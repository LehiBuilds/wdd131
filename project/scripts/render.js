export function renderEpisode(episode) {
    renderPlayer();
    renderHeader(episode.metadata);
    renderTopics(episode.metadata.keywords);
    renderTranscript(episode.paragraphs, episode.hasSync);
}

function renderHeader(metadata) {
    document.getElementById("breadcrumb-title").textContent = metadata.title;
    document.getElementById("episode-title").textContent = metadata.title;
    document.getElementById("episode-summary").textContent = metadata.summary;
    document.getElementById("episode-date").textContent = formatDate(metadata.date);
    document.getElementById("episode-duration").textContent = metadata.duration;
    document.title = `${metadata.title} | The PQCNM Podcast`;
}

export function renderPlayer() {
    document.getElementById("player-artwork").innerHTML = `
        <span class="material-symbols-outlined" aria-hidden="true">album</span>
    `;

    document.getElementById("player-controls").innerHTML = `
        <button id="previous-episode-btn" type="button" aria-label="Previous episode">
            <span class="material-symbols-outlined" aria-hidden="true">skip_previous</span>
        </button>
        <button id="skip-backward-btn" type="button" aria-label="Skip back 10 seconds">
            <span class="material-symbols-outlined" aria-hidden="true">replay_10</span>
        </button>
        <button id="play-btn" type="button" aria-label="Play">
            <span class="material-symbols-outlined" aria-hidden="true">play_arrow</span>
        </button>
        <button id="skip-forward-btn" type="button" aria-label="Skip forward 30 seconds">
            <span class="material-symbols-outlined" aria-hidden="true">forward_30</span>
        </button>
        <button id="next-episode-btn" type="button" aria-label="Next episode">
            <span class="material-symbols-outlined" aria-hidden="true">skip_next</span>
        </button>
        <div class="volume-container">
            <button id="volume-btn" type="button" aria-label="Mute / Unmute">
                <span class="material-symbols-outlined" aria-hidden="true">volume_up</span>
            </button>
            <input id="volume-slider" type="range" min="0" max="1" step="0.05" value="1" aria-label="Volume slider">
        </div>
    `;
}

function renderTopics(keywords = []) {
    const container = document.getElementById("episode-keywords");
    if (!container) return;
    container.innerHTML = "";

    keywords.forEach(keyword => {
        const span = document.createElement("span");
        span.className = "topic-tag";
        span.textContent = keyword;
        container.appendChild(span);
    });
}

function renderTranscript(paragraphs, hasSync = false) {
    const container = document.getElementById("transcript");
    const statusContainer = document.getElementById("read-along-status");
    if (!container) return;

    container.innerHTML = "";

    if (statusContainer) {
        if (hasSync) {
            statusContainer.innerHTML = `
                <div class="read-along-controls">
                    <span class="read-along-label">
                        <span class="material-symbols-outlined">bolt</span>
                        Read-Along
                    </span>
                    <label class="toggle-switch" aria-label="Toggle Read-Along mode">
                        <input type="checkbox" id="read-along-toggle" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            `;
        } else {
            statusContainer.innerHTML = `
                <span class="badge read-along-disabled">
                    <span class="material-symbols-outlined">notes</span> Text Only
                </span>
            `;
        }
    }

    paragraphs.forEach(paragraph => {
        const p = document.createElement("p");
        p.className = "transcript-paragraph";
        if (hasSync) p.classList.add("clickable");

        p.dataset.number = paragraph.number;
        p.dataset.start = paragraph.start;
        p.dataset.end = paragraph.end;
        p.textContent = paragraph.text;

        container.appendChild(p);
    });
}

function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

export function renderEpisodeList(episodes, onPlayEpisode, clear = false) {

    const container =
        document.getElementById("episode-list");

    if (clear) {
        container.innerHTML = "";
    }

    episodes.forEach(episode => {

        const card =
            createEpisodeCard(
                episode,
                onPlayEpisode
            );

        container.appendChild(card);

    });

}

function createEpisodeCard(episode, onPlayEpisode) {

    const article =
        document.createElement("article");

    article.className = "episode-card";
    article.dataset.episodeId = episode.id;
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

    link.href = `episode.html?id=${episode.id}`;
    link.target = "_blank";
    link.rel = "noopener";

    const episodeNumber =
        String(episode.id).padStart(2, "0");

    link.innerHTML = `
    <span class="episode-number">Episode ${episodeNumber}</span>
    <span class="episode-title">${episode.metadata.title}</span>
`;

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



    const playButton =
        document.createElement("button");

    playButton.type = "button";
    playButton.className = "episode-play-btn";
    playButton.dataset.episodeId = episode.id;
    playButton.setAttribute(
        "aria-label",
        `Play ${episode.metadata.title}`
    );

    playButton.innerHTML = `
    <span class="material-symbols-outlined" aria-hidden="true">
        play_arrow
    </span>
`;

    playButton.addEventListener(
        "click",
        (event) => {
            event.stopPropagation();
            onPlayEpisode(episode.id);
        }
    );


    const leftSection =
        document.createElement("div");

    leftSection.className =
        "episode-card-left";

    leftSection.append(
        playButton,
        titleGroup
    );

    const toggleButton =
        document.createElement("button");

    toggleButton.className =
        "episode-toggle-btn";

    toggleButton.type = "button";

    toggleButton.setAttribute(
        "aria-label",
        "Expand episode"
    );

    const toggleIcon =
        document.createElement("span");

    toggleIcon.className =
        "material-symbols-outlined episode-toggle-icon";

    toggleIcon.textContent =
        "expand_more";

    toggleButton.appendChild(toggleIcon);

    cardHeader.append(
        leftSection,
        toggleButton
    );

    toggleButton.addEventListener(
        "click",
        event => {
            event.stopPropagation();
            toggleCard();
        }
    );




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

    summaryCard.appendChild(topics);

    details.append(summaryCard);

    // --------------------
    // Toggle Logic
    // --------------------

    // article.addEventListener("click", toggleCard);
    // article.addEventListener("keydown", (event) => {
    //     if (event.key === "Enter" || event.key === " ") {
    //         event.preventDefault();
    //         toggleCard();
    //     }
    // });

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


function createTopics(keywords) {


    const container =
        document.createElement("div");

    container.className = "episode-tags-card";

    keywords.forEach(keyword => {

        const topic =
            document.createElement("span");

        topic.className = "topic-tag";

        topic.textContent = keyword;
        topic.title = "Search coming soon";

        container.appendChild(topic);

    });

    return container;

}
