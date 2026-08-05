const SKIP_BACKWARD_SECONDS = 10;
const SKIP_FORWARD_SECONDS = 30;

let audio;
let previousEpisodeButton;
let skipBackwardButton;
let playButton;
let skipForwardButton;
let nextEpisodeButton;
let currentTimeDisplay;
let totalTimeDisplay;
let progressFill;
let progressBar;


let episodes = [];
let currentEpisodeIndex = -1;
let episodeLoader;

let transcriptParagraphs;
let activeParagraph = null;
let activeEpisodeId = null;

export function initializePlayer() {
    audio = document.getElementById("audio-player");

    currentTimeDisplay =
        document.getElementById("current-time");

    totalTimeDisplay =
        document.getElementById("total-time");

    previousEpisodeButton =
        document.getElementById("previous-episode-btn");

    playButton =
        document.getElementById("play-btn");

    skipBackwardButton =
        document.getElementById("skip-backward-btn");

    skipForwardButton =
        document.getElementById("skip-forward-btn");
    nextEpisodeButton =
        document.getElementById("next-episode-btn");

    progressFill =
        document.getElementById("progress-fill");

    progressBar =
        document.querySelector(".progress-bar");

    transcriptParagraphs =
        document.querySelectorAll(".transcript-paragraph");

    setupAudio();
    setupControls();
}

function setupAudio() {

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

    // audio.addEventListener(
    //     "play",
    //     () => updatePlayButton(true)
    // );

    // audio.addEventListener(
    //     "pause",
    //     () => updatePlayButton(false)
    // );

    audio.addEventListener(
        "play",
        () => {
            updatePlayButton(true);
            updateEpisodeCardButton(true);
        }
    );

    audio.addEventListener(
        "pause",
        () => {
            updatePlayButton(false);
            updateEpisodeCardButton(false);
        }
    );
}

function setupControls() {
    playButton.addEventListener(
        "click", togglePlayback
    );
    previousEpisodeButton?.addEventListener(
        "click",
        playPreviousEpisode
    );

    skipBackwardButton.addEventListener(
        "click", skipBackward
    );
    skipForwardButton.addEventListener(
        "click", skipForward
    );
    nextEpisodeButton?.addEventListener(
        "click",
        playNextEpisode
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

// In player.js
async function togglePlayback() {
    try {
        if (audio.paused) {
            await audio.play();
        } else {
            audio.pause();
        }
    } catch (error) {
        if (error.name !== "AbortError") console.error(error);
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
    playButton.querySelector(".material-symbols-outlined").textContent =
        isPlaying ? "pause" : "play_arrow";

    playButton.setAttribute(
        "aria-label",
        isPlaying ? "Pause" : "Play"
    );
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

export async function loadEpisodeIntoPlayer(episode) {

    clearActiveEpisodeCard();

    activeEpisodeId = episode.id;

    currentEpisodeIndex =
        episodes.findIndex(
            item => item.id === episode.id
        );

    updateEpisodeNavigationButtons();

    setActiveEpisodeCard(activeEpisodeId);

    updateEpisodeCardButton(false);

    audio.src = episode.audioPath;

    audio.load();

    transcriptParagraphs =
        document.querySelectorAll(".transcript-paragraph");

    // No autoplay
    // await audio.play();
}

function clearActiveEpisodeCard() {

    document
        .querySelector(".episode-card.active")
        ?.classList.remove("active");

}

function setActiveEpisodeCard(episodeId) {

    document
        .querySelector(
            `.episode-card[data-episode-id="${episodeId}"]`
        )
        ?.classList.add("active");

}

function updateEpisodeCardButton(isPlaying) {

    document
        .querySelectorAll(".episode-play-btn")
        .forEach(button => {

            const icon =
                button.querySelector(".material-symbols-outlined");

            if (button.dataset.episodeId === String(activeEpisodeId)) {

                icon.textContent =
                    isPlaying ? "pause" : "play_arrow";

            } else {

                icon.textContent = "play_arrow";

            }

        });

}

export async function toggleEpisodePlayback(episode) {

    if (activeEpisodeId !== episode.id) {

        await loadEpisodeIntoPlayer(episode);

        await audio.play();

        return;
    }

    if (audio.paused) {
        await audio.play();
    } else {
        audio.pause();
    }

}

async function playPreviousEpisode() {

    if (currentEpisodeIndex <= 0) {
        return;
    }

    const previousEpisode =
        episodes[currentEpisodeIndex - 1];

    await episodeLoader(previousEpisode.id);

}


async function playNextEpisode() {

    if (currentEpisodeIndex >= episodes.length - 1) {
        return;
    }

    const nextEpisode =
        episodes[currentEpisodeIndex + 1];

    await episodeLoader(nextEpisode.id);

}

export function configureEpisodeNavigation(
    episodeList,
    loader
) {

    episodes = episodeList;
    episodeLoader = loader;

}

function updateEpisodeNavigationButtons() {

    if (!previousEpisodeButton || !nextEpisodeButton) {
        return;
    }

    if (episodes.length === 0) {
        previousEpisodeButton.disabled = true;
        nextEpisodeButton.disabled = true;
        return;
    }

    previousEpisodeButton.disabled =
        currentEpisodeIndex <= 0;

    nextEpisodeButton.disabled =
        currentEpisodeIndex >= episodes.length - 1;

}