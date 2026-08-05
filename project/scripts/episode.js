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
        initializePlayer();
        await loadEpisodeIntoPlayer(episode);
    } catch (error) {
        console.error("Could not initialize episode page:", error);
    }
});
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