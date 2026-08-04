import { loadEpisode } from "./data.js";
import { renderEpisode } from "./render.js";
import {
    initializePlayer,
    loadEpisodeIntoPlayer
} from "./player.js";

const urlParameters =
    new URLSearchParams(window.location.search);

const episodeId =
    Number(urlParameters.get("id")) || 1;

const episode =
    await loadEpisode(episodeId);

renderEpisode(episode);

initializePlayer();

await loadEpisodeIntoPlayer(episode);