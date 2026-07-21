import { Icons } from "./icons.js";

export function renderEpisode(episode) {
    renderHeader(episode.metadata);

    renderPlayerControls();

    renderTopics(episode.metadata.keywords);

    renderTranscript(episode.paragraphs);
}

function renderHeader(metadata) {
    document.getElementById("breadcrumb-title").textContent =
        metadata.title;

    document.getElementById("episode-title").textContent =
        metadata.title;

    document.getElementById("episode-summary").textContent =
        metadata.summary;

    document.getElementById("episode-date").textContent =
        metadata.date;

    document.getElementById("episode-duration").textContent =
        metadata.duration;

    document.title =
        `${metadata.title} | The PQCNM Podcast`;

    document.getElementById("player-artwork").innerHTML =
        Icons.artwork(40);
}

function renderPlayerControls() {
    document.getElementById("player-controls").innerHTML = `
        <button id="skip-backward-btn" type="button">
            ${Icons.skipBackward()}
        </button>

        <button id="play-btn" type="button">
            ${Icons.play(24)}
        </button>

        <button id="skip-forward-btn" type="button">
            ${Icons.skipForward()}
        </button>
    `;
}

function renderTopics(keywords) {
    const container =
        document.getElementById("episode-keywords");
    container.innerHTML = "";

    keywords.forEach(keyword => {
        const span = document.createElement("span");
        span.className = "topic-tag";
        span.textContent = keyword;
        container.appendChild(span);
    });
}

function renderTranscript(paragraphs) {
    const container =
        document.getElementById("transcript");
    container.innerHTML = "";
    paragraphs.forEach(paragraph => {
        const p = document.createElement("p");
        p.className = "transcript-paragraph";

        p.dataset.number = paragraph.number;
        p.dataset.start = paragraph.start;
        p.dataset.end = paragraph.end;

        p.textContent = paragraph.text;

        container.appendChild(p);
    });
}