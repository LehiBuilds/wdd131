import { Icons } from "./icons.js";

export function renderEpisode(episode) {
    renderPlayer();

    renderHeader(episode.metadata);

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

}
export function renderPlayer() {

    document.getElementById("player-artwork").innerHTML =
        Icons.artwork(40);

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

export function renderEpisodeList(
    episodes,
    onPlayEpisode
) {

    const container =
        document.getElementById("episode-list");

    container.innerHTML = "";

    episodes.forEach(episode => {

        const card =
            createEpisodeCard(
                episode,
                onPlayEpisode
            );

        container.appendChild(card);

    });

}
function createEpisodeCard(
    episode,
    onPlayEpisode
) {

    const article =
        document.createElement("article");

    article.className = "episode-card";

    // --------------------
    // Title
    // --------------------

    const title =
        document.createElement("h3");

    const link =
        document.createElement("a");

    link.href =
        `episode.html?id=${episode.id}`;

    link.textContent =
        episode.metadata.title;

    title.appendChild(link);

    // --------------------
    // Date
    // --------------------

    const date =
        document.createElement("p");

    date.textContent =
        formatDate(episode.metadata.date);

    // --------------------
    // Play Button
    // --------------------

    const playButton =
        document.createElement("button");

    playButton.type = "button";
    playButton.setAttribute(
        "aria-label",
        `Play ${episode.metadata.title}`
    );

    playButton.innerHTML =
        `${Icons.play(18)} Play`;

    playButton.addEventListener(
        "click",
        () => onPlayEpisode(episode.id)
    );
    // --------------------
    // Toggle Button
    // --------------------

    const button =
        document.createElement("button");

    button.type = "button";

    button.textContent =
        "Show Details";

    // --------------------
    // Details
    // --------------------

    const details =
        document.createElement("div");

    details.hidden = true;

    const summary =
        document.createElement("p");

    summary.textContent =
        episode.metadata.summary;

    const topics =
        createTopics(
            episode.metadata.keywords
        );

    details.append(
        summary,
        topics
    );

    // --------------------
    // Toggle Logic
    // --------------------

    button.addEventListener(
        "click",
        () => {

            details.hidden =
                !details.hidden;

            button.textContent =
                details.hidden
                    ? "Show Details"
                    : "Hide Details";

        }
    );

    // --------------------
    // Assemble
    // --------------------

    article.append(
        title,
        date,
        playButton,
        button,
        details
    );

    return article;

}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}

function createTopics(keywords) {

    const container =
        document.createElement("div");

    container.className = "episode-topics";

    keywords.forEach(keyword => {

        const topic =
            document.createElement("span");

        topic.className = "topic-tag";

        topic.textContent = keyword;

        container.appendChild(topic);

    });

    return container;

}