import { loadEpisode } from "./data.js";
import { renderEpisode } from "./render.js";
import { initializePlayer, loadEpisodeIntoPlayer } from "./player.js";

document.addEventListener("DOMContentLoaded", async () => {
    setupMobileNav();

    const urlParameters = new URLSearchParams(window.location.search);
    const episodeId = Number(urlParameters.get("id")) || 1;

    try {
        const episode = await loadEpisode(episodeId);
        renderEpisode(episode);
        setupDownloadButtons(episode);
        initializePlayer();
        await loadEpisodeIntoPlayer(episode);

        setupReadAlongSync(episode.hasSync);
    } catch (error) {
        console.error("Could not initialize episode page:", error);
    }
});

function setupReadAlongSync(hasSync) {
    if (!hasSync) return;

    const audioPlayer = document.getElementById("audio-player");
    const toggleSwitch = document.getElementById("read-along-toggle");
    const transcriptContainer = document.getElementById("transcript");

    if (!audioPlayer || !toggleSwitch || !transcriptContainer) return;

    let isReadAlongEnabled = toggleSwitch.checked;

    toggleSwitch.addEventListener("change", (e) => {
        isReadAlongEnabled = e.target.checked;
        if (!isReadAlongEnabled) {
            document.querySelectorAll(".transcript-paragraph").forEach(p => {
                p.classList.remove("active");
            });
        }
    });

    // Real-time audio sync highlighting & auto-scroll
    audioPlayer.addEventListener("timeupdate", () => {
        if (!isReadAlongEnabled) return;

        const currentTime = audioPlayer.currentTime;
        const paragraphElements = document.querySelectorAll(".transcript-paragraph");

        paragraphElements.forEach(p => {
            const start = parseFloat(p.dataset.start);
            const end = parseFloat(p.dataset.end);

            if (currentTime >= start && currentTime <= end) {
                if (!p.classList.contains("active")) {
                    paragraphElements.forEach(el => el.classList.remove("active"));
                    p.classList.add("active");
                    p.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
            }
        });
    });

    // Click paragraph to jump audio position
    transcriptContainer.addEventListener("click", (e) => {
        const paragraph = e.target.closest(".transcript-paragraph");
        if (paragraph && paragraph.dataset.start) {
            const startTime = parseFloat(paragraph.dataset.start);
            if (!isNaN(startTime)) {
                audioPlayer.currentTime = startTime;
                if (audioPlayer.paused) {
                    audioPlayer.play();
                }
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