import { loadEpisode } from "./data.js";
import { renderEpisode } from "./render.js";
import { initializePlayer } from "./player.js";

// /* =========================
//     INDEX.HTML
// =========================*/
// document.getElementById("collection-title").textContent =
//     "The Philippines Quezon City North Mission Podcast Archive 2020";

// document.getElementById("collection-link").innerHTML = `
//     ${Icons.collection()}
//     About This Collection: The PQCNM Podcast Archive 2020
//     `;

// document.getElementById("player-artwork").innerHTML =
//     Icons.artwork(40);

// document.getElementById("current-title").textContent =
//     "Select an episode to begin listening";

// document.getElementById("player-controls").innerHTML = `
//     <button>${Icons.skipBackward()}</button>
//     <button>${Icons.play(24)}</button>
//     <button>${Icons.skipForward()}</button>
//     `;

/*=========================
EPISODE.HTML
=========================*/

// document.getElementById("player-artwork").innerHTML =
//     Icons.artwork(40);

// document.getElementById("player-controls").innerHTML = `
//     <button>${Icons.skipBackward()}</button>
//     <button>${Icons.play(24)}</button>
//     <button>${Icons.skipForward()}</button>
//     `;

const urlParameters =
    new URLSearchParams(window.location.search);

const episodeId =
    Number(urlParameters.get("id")) || 1;

if (episodeId < 1 || episodeId > 5) {
    throw new Error(
        `Episode ${episodeId} is not available during testing`
    );
}

const episode =
    await loadEpisode(episodeId);

renderEpisode(episode);

initializePlayer(episode);