import { loadArchiveEpisode, loadEpisodeList } from "./data.js";
import { renderEpisodeList } from "./render.js";
import { initializePlayer, loadEpisodeIntoPlayer } from "./player.js";

const EPISODES_PER_BATCH = 10;
let visibleEpisodeCount = EPISODES_PER_BATCH;

document.getElementById("collection-title").textContent =
    "The Philippines Quezon City North Mission Podcast Archive 2020";

document.getElementById("current-title").textContent =
    "Select an episode to begin listening";

const episodes = await loadEpisodeList();
const loadMoreButton = document.getElementById("load-more-btn");

initializePlayer();

renderVisibleEpisodes();

loadMoreButton.addEventListener("click", () => {
    visibleEpisodeCount += EPISODES_PER_BATCH;
    renderVisibleEpisodes();
});

function renderVisibleEpisodes() {
    const visibleEpisodes = episodes.slice(0, visibleEpisodeCount);

    renderEpisodeList(
        visibleEpisodes,
        async (id) => {
            const episode = await loadArchiveEpisode(id);

            await loadEpisodeIntoPlayer(episode);

            document.getElementById("current-title").textContent =
                episode.metadata.title;
        }
    );

    loadMoreButton.hidden = visibleEpisodeCount >= episodes.length;
}
