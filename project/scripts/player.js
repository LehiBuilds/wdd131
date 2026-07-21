import { Icons } from "./icons.js";

const SKIP_BACKWARD_SECONDS = 15;
const SKIP_FORWARD_SECONDS = 30;

let audio;
let playButton;
let skipBackwardButton;
let skipForwardButton;
let currentTimeDisplay;
let totalTimeDisplay;
let progressFill;
let progressBar;

let transcriptParagraphs;
let activeParagraph = null;

export function initializePlayer(episode) {
    audio = document.getElementById("audio-player");

    currentTimeDisplay =
        document.getElementById("current-time");

    totalTimeDisplay =
        document.getElementById("total-time");

    playButton =
        document.getElementById("play-btn");

    skipBackwardButton =
        document.getElementById("skip-backward-btn");

    skipForwardButton =
        document.getElementById("skip-forward-btn");

    progressFill =
        document.getElementById("progress-fill");

    progressBar =
        document.querySelector(".progress-bar");

    transcriptParagraphs =
        document.querySelectorAll(".transcript-paragraph");

    setupAudio(episode);
    setupControls();
}

function setupAudio(episode) {
    audio.src = episode.audioPath;

    audio.addEventListener(
        "loadedmetadata",
        displayDuration
    );
    audio.addEventListener(
        "timeupdate",
        () => {
            updateCurrentTime();
            updateProgressBar();
            syncTranscript();

        }
    );
    audio.addEventListener(
        "ended",
        handleAudioEnded
    );
    audio.addEventListener("play", () => {
        updatePlayButton(true);
    });
    audio.addEventListener("pause", () => {
        updatePlayButton(false);
    });
}

function setupControls() {
    playButton.addEventListener(
        "click", togglePlayback
    );
    skipBackwardButton.addEventListener(
        "click", skipBackward
    );
    skipForwardButton.addEventListener(
        "click", skipForward
    );
    progressBar.addEventListener(
        "click",
        seekAudio
    );
    transcriptParagraphs.forEach(paragraph => {
        paragraph.addEventListener(
            "click",
            seekTranscript
        );
    });
}

async function togglePlayback() {
    if (audio.paused) {
        await audio.play();
    } else {
        audio.pause();
    }
}

function skipBackward() {
    audio.currentTime = Math.max(
        0,
        audio.currentTime - SKIP_BACKWARD_SECONDS
    );
}

function skipForward() {
    audio.currentTime = Math.min(
        audio.duration,
        audio.currentTime + SKIP_FORWARD_SECONDS
    );
}

function updatePlayButton(isPlaying) {
    playButton.innerHTML = isPlaying
        ? Icons.pause(24)
        : Icons.play(24);
}

function handleAudioEnded() {
    updatePlayButton(false);

    progressFill.style.width = "0%";

    currentTimeDisplay.textContent = "0.00";

}

function displayDuration() {
    totalTimeDisplay.textContent =
        formatTime(audio.duration);
}

function formatTime(seconds) {
    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function updateCurrentTime() {
    currentTimeDisplay.textContent =
        formatTime(audio.currentTime);
}
function updateProgressBar() {
    const percent =
        (audio.currentTime / audio.duration) * 100;

    progressFill.style.width = `${percent}%`;
}

function seekAudio(event) {
    const rect =
        progressBar.getBoundingClientRect();

    const clickX =
        event.clientX - rect.left;

    const percent =
        clickX / rect.width;

    audio.currentTime =
        percent * audio.duration;
}

function syncTranscript() {
    const currentTime = audio.currentTime;

    transcriptParagraphs.forEach(paragraph => {
        const start =
            Number(paragraph.dataset.start);

        const end =
            Number(paragraph.dataset.end);

        if (currentTime >= start &&
            currentTime < end) {
            highlightParagraph(paragraph);
        }
    });
}

function highlightParagraph(paragraph) {

    if (activeParagraph === paragraph) {
        return;
    }

    if (activeParagraph) {
        activeParagraph.classList.remove("active");

    }
    paragraph.classList.add("active");

    paragraph.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    activeParagraph = paragraph;
}

function seekTranscript(event) {
    const paragraph =
        event.currentTarget;

    audio.currentTime =
        Number(paragraph.dataset.start);
}