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

document.getElementById("collection-title").textContent =
    "The Philippines Quezon City North Mission Podcast Archive 2020";

document.getElementById("current-title").textContent =
    "Select an episode to begin listening";

const episodes = await loadEpisodeList();
initializeArchiveNavigation(episodes);
const loadMoreButton = document.getElementById("load-more-btn");

// 1. Render player buttons first
renderPlayer();

// 2. Attach button click listeners
initializePlayer();

// 3. Configure episode list & loader for prev/next buttons
configureEpisodeNavigation(
    episodes,
    async (id) => {
        const episode = await loadArchiveEpisode(id);
        await toggleEpisodePlayback(episode);
        document.getElementById("current-title").textContent =
            episode.metadata.title;
    }
);

renderVisibleEpisodes();

loadMoreButton.addEventListener("click", renderVisibleEpisodes);

function renderVisibleEpisodes() {
    const batch = episodes.slice(
        nextEpisodeIndex,
        nextEpisodeIndex + EPISODES_PER_BATCH
    );

    renderEpisodeList(
        batch,
        async (id) => {
            const episode = await loadArchiveEpisode(id);

            await toggleEpisodePlayback(episode);

            document.getElementById("current-title").textContent =
                episode.metadata.title;
        }
    );

    nextEpisodeIndex += batch.length;

    loadMoreButton.hidden =
        nextEpisodeIndex >= episodes.length;
}

// Add this helper or include inside your initialization logic in index.js
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

// Call inside your main DOMContentLoaded listener:
setupMobileNav();