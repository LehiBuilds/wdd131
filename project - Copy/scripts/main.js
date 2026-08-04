import {
    loadEpisode,
    loadEpisodeList
} from "./data.js";
import {
    renderEpisode,
    renderEpisodeList,
    renderPlayer
} from "./render.js";
import {
    initializePlayer,
    loadEpisodeIntoPlayer
} from "./player.js";

/* =========================
    INDEX.HTML
========================= */

if (document.getElementById("episode-list")) {

    const episodes =
        await loadEpisodeList();

    renderPlayer();
    initializePlayer();

    renderEpisodeList(
        episodes,
        async (id) => {
            const episode = await loadEpisode(id);

            await loadEpisodeIntoPlayer(episode);

            document.getElementById("current-title").textContent =
                episode.metadata.title;
        });

    document.getElementById("current-title").textContent =
        "Select an episode to begin listening";
}

/* =========================
    EPISODE.HTML
========================= */

if (document.getElementById("audio-player")) {

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

    initializePlayer();

    await loadEpisodeIntoPlayer(episode);

}