import { loadArchiveEpisode, loadEpisodeList } from "./data.js";
import { renderEpisodeList, renderPlayer } from "./render.js";
import {
    initializePlayer,
    toggleEpisodePlayback,
    configureEpisodeNavigation
} from "./player.js";
import { initializeArchiveNavigation } from "./archive-navigation.js";

const EPISODES_PER_BATCH = 10;
let nextEpisodeIndex = 0;
let episodes = [];

document.addEventListener("DOMContentLoaded", async () => {
    setupMobileNav();

    const collectionTitle = document.getElementById("collection-title");
    const currentTitle = document.getElementById("current-title");
    const loadMoreButton = document.getElementById("load-more-btn");

    if (collectionTitle) {
        collectionTitle.textContent = "The Philippines Quezon City North Mission Podcast Archive 2020";
    }

    if (currentTitle) {
        currentTitle.textContent = "Select an episode to begin listening";
    }

    // Render player controls and setup audio listeners
    renderPlayer();
    initializePlayer();

    try {
        episodes = await loadEpisodeList();
        initializeArchiveNavigation(episodes);

        // Configure player navigation buttons (prev / next)
        configureEpisodeNavigation(episodes, handleEpisodePlay);

        // Render initial batch of episodes
        renderVisibleEpisodes();

        if (loadMoreButton) {
            loadMoreButton.addEventListener("click", renderVisibleEpisodes);
        }
    } catch (error) {
        console.error("Failed to load archive episodes:", error);
    }
});

// Centralized play handler to avoid code duplication
async function handleEpisodePlay(id) {
    const episode = await loadArchiveEpisode(id);
    await toggleEpisodePlayback(episode);

    const currentTitleEl = document.getElementById("current-title");
    if (currentTitleEl && episode.metadata) {
        const episodeNum = String(episode.id).padStart(2, "0");
        currentTitleEl.textContent = `Episode ${episodeNum}: ${episode.metadata.title}`;
    }
}

function renderVisibleEpisodes() {
    const loadMoreButton = document.getElementById("load-more-btn");
    const batch = episodes.slice(nextEpisodeIndex, nextEpisodeIndex + EPISODES_PER_BATCH);

    renderEpisodeList(batch, handleEpisodePlay);

    nextEpisodeIndex += batch.length;
    if (loadMoreButton) {
        loadMoreButton.hidden = nextEpisodeIndex >= episodes.length;
    }
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