import { Icons } from "./icons.js";

const SKIP_BACKWARD_SECONDS = 15;
const SKIP_FORWARD_SECONDS = 30;

let audio;
let playButton;
let skipBackwardButton;
let skipForwardButton;
let currentTimeDisplay;
let totalTimeDisplay;

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

    setupAudio(episode);
    setupControls();
}

function setupAudio(episode) {
    audio.src = episode.audioPath;
    audio.addEventListener(
        "ended",
        handleAudioEnded);
    audio.addEventListener(
        "loadedmetadata",
        displayDuration
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

}

function displayDuration() {
    totalTimeDisplay.textContent =
        fomatTime(audio.duration);
}

function formatTime(seconds) {
    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}