import { loadEpisode, loadEpisodeList } from "./data.js";
import { renderEpisodeList, renderPlayer } from "./render.js";
import {
    initializePlayer,
    loadEpisodeIntoPlayer
} from "./player.js";

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