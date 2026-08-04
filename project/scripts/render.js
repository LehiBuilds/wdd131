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

    document.getElementById("player-artwork").innerHTML = `
        <span class="material-symbols-outlined" aria-hidden="true">album</span>
    `;

    document.getElementById("player-controls").innerHTML = `
        <button id="skip-backward-btn" type="button" aria-label="Skip back 15 seconds">
            <span class="material-symbols-outlined" aria-hidden="true">replay_10</span>
        </button>

        <button id="play-btn" type="button" aria-label="Play">
            <span class="material-symbols-outlined" aria-hidden="true">play_arrow</span>
        </button>

        <button id="skip-forward-btn" type="button" aria-label="Skip forward 30 seconds">
            <span class="material-symbols-outlined" aria-hidden="true">forward_30</span>
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
    article.tabIndex = 0;
    article.setAttribute("aria-expanded", "false");

    // --------------------
    // Header
    // --------------------

    const cardHeader =
        document.createElement("div");

    cardHeader.className = "episode-card-header";

    const titleGroup =
        document.createElement("div");

    titleGroup.className = "episode-title-group";

    const title =
        document.createElement("h3");

    const link =
        document.createElement("a");

    link.href =
        `episode.html?id=${episode.id}`;

    link.textContent =
        episode.metadata.title;

    title.appendChild(link);

    const meta =
        document.createElement("p");

    meta.className = "episode-meta";
    meta.textContent = [
        formatDate(episode.metadata.date),
        episode.metadata.duration
    ].filter(Boolean).join(" / ");

    titleGroup.append(title, meta);

    // --------------------
    // Actions
    // --------------------

    const actions =
        document.createElement("div");

    actions.className = "episode-card-actions";

    const playButton =
        document.createElement("button");

    playButton.type = "button";
    playButton.className = "episode-play-btn";
    playButton.setAttribute(
        "aria-label",
        `Play ${episode.metadata.title}`
    );

    playButton.innerHTML = `
        <span class="material-symbols-outlined" aria-hidden="true">play_arrow</span>
        <span>Play</span>
    `;

    playButton.addEventListener(
        "click",
        (event) => {
            event.stopPropagation();
            onPlayEpisode(episode.id);
        }
    );

    const toggleIcon =
        document.createElement("span");

    toggleIcon.className = "material-symbols-outlined episode-toggle-icon";
    toggleIcon.setAttribute("aria-hidden", "true");
    toggleIcon.textContent = "expand_more";

    actions.append(playButton, toggleIcon);
    cardHeader.append(titleGroup, actions);

    // --------------------
    // Details
    // --------------------

    const details =
        document.createElement("div");

    details.className = "episode-details-panel";
    details.hidden = true;

    const summaryCard =
        document.createElement("div");

    summaryCard.className = "episode-summary-card";

    const summary =
        document.createElement("p");

    summary.textContent =
        episode.metadata.summary;

    summaryCard.appendChild(summary);

    const topics =
        createTopics(
            episode.metadata.keywords
        );

    details.append(
        summaryCard,
        topics
    );

    // --------------------
    // Toggle Logic
    // --------------------

    article.addEventListener("click", toggleCard);
    article.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleCard();
        }
    });

    link.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    function toggleCard() {
        const isExpanded = article.getAttribute("aria-expanded") === "true";

        article.setAttribute("aria-expanded", String(!isExpanded));
        details.hidden = isExpanded;
    }

    // --------------------
    // Assemble
    // --------------------

    article.append(
        cardHeader,
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

    container.className = "episode-tags-card";

    keywords.forEach(keyword => {

        const topic =
            document.createElement("span");

        topic.className = "topic-tag";

        topic.textContent = keyword;

        container.appendChild(topic);

    });

    return container;

}
