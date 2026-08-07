import { loadEpisode, loadEpisodeList } from "./data.js";
import { renderEpisode } from "./render.js";
import {
    initializePlayer,
    loadEpisodeIntoPlayer,
    configureEpisodeNavigation,
    refreshPlayerControls
} from "./player.js";

document.addEventListener("DOMContentLoaded", async () => {
    setupMobileNav();
    setupReadAlongSync();

    const urlParameters = new URLSearchParams(window.location.search);
    const episodeId = Number(urlParameters.get("id")) || 1;

    try {
        // Load the requested episode and the full archive order in parallel,
        // so Previous/Next Episode buttons work relative to the whole archive.
        const [episode, episodeList] = await Promise.all([
            loadEpisode(episodeId),
            loadEpisodeList()
        ]);

        configureEpisodeNavigation(episodeList, loadEpisodeById);

        // renderEpisode() injects the player's buttons into #player-controls -
        // must happen before initializePlayer() queries for them.
        renderEpisode(episode);
        setupDownloadButtons(episode);
        setupBackLink(episode);
        setupReadAlongToggleButton(episode.hasSync);

        initializePlayer();
        await loadEpisodeIntoPlayer(episode);
    } catch (error) {
        console.error("Could not initialize episode page:", error);
    }
});

// Handles Previous/Next Episode clicks (called by player.js) as well as any
// future in-place episode switch: re-renders the page content without a
// full reload and keeps the URL/back-button in sync.
async function loadEpisodeById(id) {
    try {
        const episode = await loadEpisode(id);

        renderEpisode(episode);
        setupDownloadButtons(episode);
        setupBackLink(episode);
        setupReadAlongToggleButton(episode.hasSync);
        refreshPlayerControls();
        await loadEpisodeIntoPlayer(episode);

        const url = new URL(window.location);
        url.searchParams.set("id", episode.id);
        window.history.pushState({ episodeId: episode.id }, "", url);

        window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
        console.error(`Could not load episode ${id}:`, error);
    }
}

// Support browser back/forward between episodes visited via Previous/Next
window.addEventListener("popstate", () => {
    const urlParameters = new URLSearchParams(window.location.search);
    const episodeId = Number(urlParameters.get("id")) || 1;
    loadEpisodeById(episodeId);
});

// renderPlayer() (called every episode load) rebuilds #player-controls from
// scratch, so this button has to be re-injected after each render rather
// than created once.
function setupReadAlongToggleButton(hasSync) {
    const playerControls = document.getElementById("player-controls");
    if (!playerControls) return;

    playerControls.querySelector("#read-along-toggle-btn")?.remove();
    if (!hasSync) return;

    const button = document.createElement("button");
    button.type = "button";
    button.id = "read-along-toggle-btn";
    button.className = "read-along-toggle-btn active";
    button.setAttribute("aria-pressed", "true");
    button.setAttribute("aria-label", "Toggle Read-Along");
    button.title = "Toggle Read-Along";
    button.innerHTML = `
        <span class="material-symbols-outlined" aria-hidden="true">bolt</span>
        <span class="read-along-toggle-text">Read-Along</span>
    `;

    button.addEventListener("click", () => {
        const isActive = button.classList.toggle("active");
        button.setAttribute("aria-pressed", String(isActive));
        if (!isActive) {
            document.querySelectorAll(".transcript-paragraph").forEach(p => {
                p.classList.remove("active");
            });
        }
    });

    const volumeContainer = playerControls.querySelector(".volume-container");
    if (volumeContainer) {
        playerControls.insertBefore(button, volumeContainer);
    } else {
        playerControls.appendChild(button);
    }
}

// Bound once. The toggle button and transcript paragraphs get replaced every
// time an episode renders, so this reads their live state from the DOM on
// each event rather than closing over references that would go stale.
function setupReadAlongSync() {
    const audioPlayer = document.getElementById("audio-player");
    const transcriptContainer = document.getElementById("transcript");

    if (!audioPlayer || !transcriptContainer) return;

    // Real-time audio sync highlighting & auto-scroll
    audioPlayer.addEventListener("timeupdate", () => {
        const toggleBtn = document.getElementById("read-along-toggle-btn");
        if (!toggleBtn || !toggleBtn.classList.contains("active")) return;

        const currentTime = audioPlayer.currentTime;
        const paragraphElements = document.querySelectorAll(".transcript-paragraph");

        paragraphElements.forEach(p => {
            const start = parseFloat(p.dataset.start);
            const end = parseFloat(p.dataset.end);

            if (!isNaN(start) && !isNaN(end) && currentTime >= start && currentTime <= end) {
                if (!p.classList.contains("active")) {
                    paragraphElements.forEach(el => el.classList.remove("active"));
                    p.classList.add("active");
                    p.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
        });
    });

    // Click paragraph to jump audio position ONLY if clickable / sync-enabled
    transcriptContainer.addEventListener("click", (e) => {
        const paragraph = e.target.closest(".transcript-paragraph.clickable");
        if (!paragraph || !paragraph.dataset.start) return;

        const startTime = parseFloat(paragraph.dataset.start);
        if (!isNaN(startTime) && startTime >= 0) {
            audioPlayer.currentTime = startTime;
            if (audioPlayer.paused) {
                audioPlayer.play();
            }
        }
    });
}

function setupMobileNav() {
    const toggleBtn = document.getElementById("nav-toggle");
    const nav = document.querySelector("header nav");

    if (!toggleBtn || !nav) return;

    toggleBtn.addEventListener("click", () => {
        const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
        toggleBtn.setAttribute("aria-expanded", String(!isExpanded));
        nav.classList.toggle("open");

        const icon = toggleBtn.querySelector(".material-symbols-outlined");
        if (icon) {
            icon.textContent = isExpanded ? "menu" : "close";
        }
    });
}

function setupDownloadButtons(episode) {
    const audioBtn = document.getElementById("download-audio-btn");
    const transcriptBtn = document.getElementById("download-transcript-btn");

    if (audioBtn && episode.audioPath) {
        audioBtn.href = episode.audioPath;
    }

    if (transcriptBtn && episode.metadata) {
        const episodeNum = String(episode.id).padStart(2, "0");
        const transcriptFileName = episode.metadata.transcript || "transcript.json";
        transcriptBtn.href = `episodes/episode-${episodeNum}/${transcriptFileName}`;
    }
}

// Points "Back to Archive" at the episode currently playing, so index.js can
// scroll the archive back to that card instead of landing at the top.
function setupBackLink(episode) {
    const backLink = document.querySelector(".back-link");
    if (backLink && episode?.id) {
        backLink.href = `index.html?ep=${episode.id}`;
    }
}