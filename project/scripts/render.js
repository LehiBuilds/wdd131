export function renderEpisode(episode) {
    renderPlayer();
    renderHeader(episode);
    renderTopics(episode.metadata?.keywords || []);
    renderTranscript(episode.paragraphs, episode.hasSync);
}

function renderHeader(episode) {
    const episodeNum = String(episode.id).padStart(2, "0");
    const fullTitle = `Episode ${episodeNum}: ${episode.metadata?.title || ""}`;

    // Safely check elements before assigning text
    const breadcrumbTitle = document.getElementById("breadcrumb-title");
    if (breadcrumbTitle) breadcrumbTitle.textContent = episode.metadata?.title || "";

    const episodeTitle = document.getElementById("episode-title");
    if (episodeTitle) episodeTitle.textContent = fullTitle;

    const summaryEl = document.getElementById("episode-summary");
    if (summaryEl) summaryEl.textContent = episode.metadata?.summary || "";

    const dateEl = document.getElementById("episode-date");
    if (dateEl) dateEl.textContent = formatDate(episode.metadata?.date);

    const durationEl = document.getElementById("episode-duration");
    if (durationEl) durationEl.textContent = episode.metadata?.duration || "";

    document.title = `${fullTitle} | The PQCNM Podcast`;
}

// export function renderPlayer() {
//     const artworkEl = document.getElementById("player-artwork");
//     if (artworkEl) {
//         artworkEl.innerHTML = `
//             <span class="material-symbols-outlined" aria-hidden="true">album</span>
//         `;
//     }

//     const controlsEl = document.getElementById("player-controls");
//     if (controlsEl) {
//         controlsEl.innerHTML = `
//             <button id="previous-episode-btn" type="button" aria-label="Previous episode">
//                 <span class="material-symbols-outlined" aria-hidden="true">skip_previous</span>
//             </button>
//             <button id="skip-backward-btn" type="button" aria-label="Skip back 10 seconds">
//                 <span class="material-symbols-outlined" aria-hidden="true">replay_10</span>
//             </button>
//             <button id="play-btn" type="button" aria-label="Play">
//                 <span class="material-symbols-outlined" aria-hidden="true">play_arrow</span>
//             </button>
//             <button id="skip-forward-btn" type="button" aria-label="Skip forward 30 seconds">
//                 <span class="material-symbols-outlined" aria-hidden="true">forward_30</span>
//             </button>
//             <button id="next-episode-btn" type="button" aria-label="Next episode">
//                 <span class="material-symbols-outlined" aria-hidden="true">skip_next</span>
//             </button>
//             <div class="volume-container">
//                 <button id="volume-btn" type="button" aria-label="Mute / Unmute">
//                     <span class="material-symbols-outlined" aria-hidden="true">volume_up</span>
//                 </button>
//                 <input id="volume-slider" type="range" min="0" max="1" step="0.05" value="1" aria-label="Volume slider">
//             </div>
//         `;
//     }
// }

export function renderPlayer() {
    const controlsEl = document.getElementById("player-controls");
    if (controlsEl) {
        controlsEl.innerHTML = `
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

function renderTranscript(paragraphs = [], hasSync = false) {
    const container = document.getElementById("transcript");
    const statusContainer = document.getElementById("read-along-status");
    if (!container) return;

    container.innerHTML = "";

    if (statusContainer) {
        if (hasSync) {
            statusContainer.innerHTML = "";
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

        if (hasSync) {
            const timestamp = document.createElement("span");
            timestamp.className = "transcript-timestamp";
            timestamp.textContent = formatTimestamp(paragraph.start);
            p.appendChild(timestamp);
        }

        const text = document.createElement("span");
        text.className = "transcript-text";
        text.textContent = paragraph.text;
        p.appendChild(text);

        container.appendChild(p);
    });
}

function formatTimestamp(seconds) {
    if (typeof seconds !== "number" || isNaN(seconds)) return "";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
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
    const container = document.getElementById("episode-list");
    if (!container) return;

    if (clear) {
        container.innerHTML = "";
    }

    episodes.forEach(episode => {
        const card = createEpisodeCard(episode, onPlayEpisode);
        container.appendChild(card);
    });
}

function createEpisodeCard(episode, onPlayEpisode) {
    const article = document.createElement("article");
    article.className = "episode-card";
    article.dataset.episodeId = episode.id;
    article.setAttribute("aria-expanded", "false");

    const cardHeader = document.createElement("div");
    cardHeader.className = "episode-card-header";

    const titleGroup = document.createElement("div");
    titleGroup.className = "episode-title-group";

    const title = document.createElement("h3");
    const link = document.createElement("a");

    link.href = `episode.html?id=${episode.id}`;
    link.target = "_top";
    link.rel = "noopener";

    const episodeNumber = String(episode.id).padStart(2, "0");
    link.innerHTML = `
        <span class="episode-number">Episode ${episodeNumber}</span>
        <span class="episode-title">${episode.metadata.title}</span>
    `;

    title.appendChild(link);

    const meta = document.createElement("p");
    meta.className = "episode-meta";
    meta.textContent = [
        formatDate(episode.metadata.date),
        episode.metadata.duration
    ].filter(Boolean).join(" / ");

    titleGroup.append(title, meta);

    const playButton = document.createElement("button");
    playButton.type = "button";
    playButton.className = "episode-play-btn";
    playButton.dataset.episodeId = episode.id;
    playButton.setAttribute("aria-label", `Play ${episode.metadata.title}`);

    playButton.innerHTML = `
        <span class="material-symbols-outlined" aria-hidden="true">
            play_arrow
        </span>
    `;

    playButton.addEventListener("click", (event) => {
        event.stopPropagation();
        onPlayEpisode(episode.id);
    });

    const leftSection = document.createElement("div");
    leftSection.className = "episode-card-left";
    leftSection.append(playButton, titleGroup);

    const toggleButton = document.createElement("button");
    toggleButton.className = "episode-toggle-btn";
    toggleButton.type = "button";
    toggleButton.setAttribute("aria-label", "Expand episode");

    const toggleIcon = document.createElement("span");
    toggleIcon.className = "material-symbols-outlined episode-toggle-icon";
    toggleIcon.textContent = "expand_more";
    toggleButton.appendChild(toggleIcon);

    cardHeader.append(leftSection, toggleButton);

    toggleButton.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleCard();
    });

    const details = document.createElement("div");
    details.className = "episode-details-panel";
    details.hidden = true;

    const summaryCard = document.createElement("div");
    summaryCard.className = "episode-summary-card";

    const summary = document.createElement("p");
    summary.textContent = episode.metadata.summary;

    summaryCard.appendChild(summary);

    const topics = createTopics(episode.metadata.keywords || []);
    summaryCard.appendChild(topics);

    details.append(summaryCard);

    link.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    function toggleCard() {
        const isExpanded = article.getAttribute("aria-expanded") === "true";
        article.setAttribute("aria-expanded", String(!isExpanded));
        details.hidden = isExpanded;
    }

    article.append(cardHeader, details);
    return article;
}

function createTopics(keywords) {
    const container = document.createElement("div");
    container.className = "episode-tags-card";

    keywords.forEach(keyword => {
        const topic = document.createElement("span");
        topic.className = "topic-tag";
        topic.textContent = keyword;
        topic.title = "Search coming soon";
        container.appendChild(topic);
    });

    return container;
}   