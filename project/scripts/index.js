import { loadEpisode, loadEpisodeList } from "./data.js";
import { renderEpisodeList, renderPlayer } from "./render.js";
import { initializePlayer, loadEpisodeIntoPlayer } from "./player.js";
import { Icons } from "./icons.js";

document.getElementById("collection-title").textContent =
    "The Philippines Quezon City North Mission Podcast Archive 2020";

document.getElementById("collection-link").innerHTML = `
    ${Icons.collection()}
    About This Collection: The PQCNM Podcast Archive 2020
    `;

document.getElementById("player-artwork").innerHTML =
    Icons.artwork(40);

document.getElementById("current-title").textContent =
    "Select an episode to begin listening";

document.getElementById("player-controls").innerHTML = `
    <button>${Icons.skipBackward()}</button>
    <button>${Icons.play(24)}</button>
    <button>${Icons.skipForward()}</button>
    `;

const episodes = await loadEpisodeList();

renderPlayer();
initializePlayer();

renderEpisodeList(
    episodes,
    async (id) => {
        const episode = await loadEpisode(id);

        await loadEpisodeIntoPlayer(episode);

        document.getElementById("current-title").textContent =
            episode.metadata.title;
    }
);

document.getElementById("current-title").textContent =
    "Select an episode to begin listening";