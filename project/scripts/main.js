import { loadEpisode, loadEpisodeList } from "./data.js";
import { renderEpisode } from "./render.js";
import { renderEpisodeList } from "./archive.js";
import { initializePlayer } from "./player.js";

/* =========================
    INDEX.HTML
========================= */

if (document.getElementById("episode-list")) {

    const episodes =
        await loadEpisodeList();

    renderEpisodeList(episodes);

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

    initializePlayer(episode);

}