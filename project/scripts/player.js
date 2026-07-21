import { Icons } from "./icons.js";

let audio;
let playButton;
let skipBackwardButton;
let skipForwardButton;

export function initializePlayer(episode) {
    audio = document.getElementById("audio-player");

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
    audio.addEventListener("ended", handleAudioEnded);
}

function setupControls() {
    playButton.addEventListener(
        "click", togglePlayBack
    );
    skipBackwardButton.addEventListener(
        "click", skipBackward
    );
    skipForwardButton.addEventListener(
        "click", skipForward
    );
}

async function togglePlayBack() {
    if (audio.paused) {
        await audio.play();
        updatePlayButton(true);
    } else {
        audio.pause();
        updatePlayButton(false);
    }

}

function skipBackward() {
    audio.currentTime = Math.max(0, audio.currentTime - 15);
}

function skipForward() {
    audio.currentTime = Math.min(
        audio.duration,
        audio.currentTime + 30
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