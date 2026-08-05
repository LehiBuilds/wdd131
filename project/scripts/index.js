import { loadArchiveEpisode, loadEpisodeList } from "./data.js";
import { renderEpisodeList } from "./render.js";
import { initializePlayer, toggleEpisodePlayback } from "./player.js";

const EPISODES_PER_BATCH = 10;
let nextEpisodeIndex = 0;

document.getElementById("collection-title").textContent =
    "The Philippines Quezon City North Mission Podcast Archive 2020";

document.getElementById("current-title").textContent =
    "Select an episode to begin listening";

const episodes = await loadEpisodeList();
const loadMoreButton = document.getElementById("load-more-btn");

initializePlayer();

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
