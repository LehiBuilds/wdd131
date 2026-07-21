// render.js

export function renderEpisode(episode) {
    renderHeader(episode.metadata);

    renderTopics(episode.metadata.keywords);

    renderTranscript(episode.paragraphs);

    document.getElementById("audio-player").src =
        episode.audioPath;
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