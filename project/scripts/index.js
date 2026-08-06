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

        // Returning from an episode page ("Back to Archive") should land
        // back on that episode's card, not the top of the list.
        const params = new URLSearchParams(window.location.search);
        const returnEpisodeId = Number(params.get("ep"));
        if (returnEpisodeId) {
            scrollToEpisodeCard(returnEpisodeId);
            window.history.replaceState({}, "", "index.html");
        }
    } catch (error) {
        console.error("Failed to load archive episodes:", error);
    }
});

// Keeps loading batches (same as clicking "Load More") until the target
// episode's card exists in the DOM, then scrolls to it and briefly flashes it.
function scrollToEpisodeCard(episodeId) {
    while (
        !document.querySelector(`[data-episode-id="${episodeId}"]`) &&
        nextEpisodeIndex < episodes.length
    ) {
        renderVisibleEpisodes();
    }

    const card = document.querySelector(`[data-episode-id="${episodeId}"]`);
    if (!card) return;

    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("highlight-return");
    card.addEventListener(
        "animationend",
        () => card.classList.remove("highlight-return"),
        { once: true }
    );
}

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