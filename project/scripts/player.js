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

let volumeButton;
let volumeSlider;
let volumeContainer;

let episodes = [];
let currentEpisodeIndex = -1;
let episodeLoader;

let activeEpisodeId = null;

export function initializePlayer() {
    audio = document.getElementById("audio-player");
    currentTimeDisplay = document.getElementById("current-time");
    totalTimeDisplay = document.getElementById("total-time");
    progressFill = document.getElementById("progress-fill");
    progressBar = document.querySelector(".progress-bar");

    setupAudio();
    refreshPlayerControls();
    setupVolumeOutsideClickCollapse();
}

// renderPlayer() rebuilds the buttons inside #player-controls (including the
// volume control) from scratch every time an episode renders - e.g. on every
// Previous/Next click on the episode page. Their listeners would otherwise be
// left attached to removed nodes, so this re-queries and re-binds them.
// The audio element, progress bar, and time displays are static markup and
// are only ever queried once, in initializePlayer().
export function refreshPlayerControls() {
    previousEpisodeButton = document.getElementById("previous-episode-btn");
    playButton = document.getElementById("play-btn");
    skipBackwardButton = document.getElementById("skip-backward-btn");
    skipForwardButton = document.getElementById("skip-forward-btn");
    nextEpisodeButton = document.getElementById("next-episode-btn");
    volumeButton = document.getElementById("volume-btn");
    volumeSlider = document.getElementById("volume-slider");
    volumeContainer = document.querySelector(".volume-container");

    setupControls();
}

function setupVolumeOutsideClickCollapse() {
    document.addEventListener("click", (event) => {
        if (!volumeContainer || !volumeContainer.classList.contains("expanded")) return;
        if (!volumeContainer.contains(event.target)) {
            volumeContainer.classList.remove("expanded");
        }
    });
}

function setupAudio() {
    if (!audio) return;

    audio.addEventListener("loadedmetadata", displayDuration);
    audio.addEventListener("timeupdate", () => {
        updateCurrentTime();
        updateProgressBar();
    });

    audio.addEventListener("ended", handleAudioEnded);

    audio.addEventListener("play", () => {
        updatePlayButton(true);
        updateEpisodeCardButton(true);
    });

    audio.addEventListener("pause", () => {
        updatePlayButton(false);
        updateEpisodeCardButton(false);
    });
}

function setupControls() {
    playButton?.addEventListener("click", togglePlayback);
    previousEpisodeButton?.addEventListener("click", playPreviousEpisode);
    skipBackwardButton?.addEventListener("click", skipBackward);
    skipForwardButton?.addEventListener("click", skipForward);
    nextEpisodeButton?.addEventListener("click", playNextEpisode);
    progressBar?.addEventListener("click", seekAudio);
    volumeSlider?.addEventListener("input", handleVolumeChange);
    volumeButton?.addEventListener("click", toggleVolumeSlider);
}

async function togglePlayback() {
    if (!audio) return;
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
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - SKIP_BACKWARD_SECONDS);
}

function skipForward() {
    if (!audio) return;
    audio.currentTime = Math.min(audio.duration, audio.currentTime + SKIP_FORWARD_SECONDS);
}

function updatePlayButton(isPlaying) {
    if (!playButton) return;
    const icon = playButton.querySelector(".material-symbols-outlined");
    if (icon) icon.textContent = isPlaying ? "pause" : "play_arrow";
    playButton.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
}

function handleAudioEnded() {
    updatePlayButton(false);
    if (progressFill) progressFill.style.width = "0%";
    if (currentTimeDisplay) currentTimeDisplay.textContent = "0:00";
}

function displayDuration() {
    if (totalTimeDisplay && audio) {
        totalTimeDisplay.textContent = formatTime(audio.duration);
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function updateCurrentTime() {
    if (currentTimeDisplay && audio) {
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }
}

function updateProgressBar() {
    if (progressFill && audio && audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percent}%`;
    }
}

function seekAudio(event) {
    if (!progressBar || !audio) return;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percent = clickX / rect.width;
    audio.currentTime = percent * audio.duration;
}

export async function loadEpisodeIntoPlayer(episode) {
    clearActiveEpisodeCard();

    activeEpisodeId = episode.id;
    currentEpisodeIndex = episodes.findIndex(item => item.id === episode.id);

    updateEpisodeNavigationButtons();
    setActiveEpisodeCard(activeEpisodeId);
    updateEpisodeCardButton(false);

    if (audio) {
        audio.src = episode.audioPath;
        audio.load();
    }
}

function clearActiveEpisodeCard() {
    document.querySelector(".episode-card.active")?.classList.remove("active");
}

function setActiveEpisodeCard(episodeId) {
    document.querySelector(`.episode-card[data-episode-id="${episodeId}"]`)?.classList.add("active");
}

function updateEpisodeCardButton(isPlaying) {
    document.querySelectorAll(".episode-play-btn").forEach(button => {
        const icon = button.querySelector(".material-symbols-outlined");
        if (!icon) return;

        if (button.dataset.episodeId === String(activeEpisodeId)) {
            icon.textContent = isPlaying ? "pause" : "play_arrow";
        } else {
            icon.textContent = "play_arrow";
        }
    });
}

export async function toggleEpisodePlayback(episode) {
    if (activeEpisodeId !== episode.id) {
        await loadEpisodeIntoPlayer(episode);
        if (audio) await audio.play();
        return;
    }

    if (audio.paused) {
        await audio.play();
    } else {
        audio.pause();
    }
}

async function playPreviousEpisode() {
    if (currentEpisodeIndex <= 0) return;
    const previousEpisode = episodes[currentEpisodeIndex - 1];
    if (typeof episodeLoader === "function") {
        await episodeLoader(previousEpisode.id);
    }
}

async function playNextEpisode() {
    if (currentEpisodeIndex >= episodes.length - 1) return;
    const nextEpisode = episodes[currentEpisodeIndex + 1];
    if (typeof episodeLoader === "function") {
        await episodeLoader(nextEpisode.id);
    }
}

export function configureEpisodeNavigation(episodeList, loader) {
    episodes = episodeList;
    episodeLoader = loader;
}

function updateEpisodeNavigationButtons() {
    if (!previousEpisodeButton || !nextEpisodeButton) return;

    if (episodes.length === 0) {
        previousEpisodeButton.disabled = true;
        nextEpisodeButton.disabled = true;
        return;
    }

    previousEpisodeButton.disabled = currentEpisodeIndex <= 0;
    nextEpisodeButton.disabled = currentEpisodeIndex >= episodes.length - 1;
}

function handleVolumeChange(event) {
    if (!audio) return;
    const value = parseFloat(event.target.value);
    audio.volume = value;
    updateVolumeIcon(value);
}

function toggleVolumeSlider() {
    volumeContainer?.classList.toggle("expanded");
}

function updateVolumeIcon(volume) {
    if (!volumeButton) return;
    const icon = volumeButton.querySelector(".material-symbols-outlined");
    if (!icon) return;

    if (volume === 0) {
        icon.textContent = "volume_off";
    } else if (volume < 0.5) {
        icon.textContent = "volume_down";
    } else {
        icon.textContent = "volume_up";
    }
}