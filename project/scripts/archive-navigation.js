export function initializeArchiveNavigation(episodes) {
    const tocList = document.getElementById("toc-list");
    if (!tocList) return;

    tocList.innerHTML = "";

    // Create a jump marker every 10 episodes
    const jumpEpisodes = episodes.filter((_, index) => index % 10 === 0);

    jumpEpisodes.forEach(episode => {
        const item = document.createElement("button");
        item.className = "toc-item";
        item.type = "button";
        item.dataset.tocId = episode.id;
        item.setAttribute("aria-label", `Jump to Episode ${episode.id}`);

        item.innerHTML = `
            <span class="toc-tooltip">Ep ${episode.id}</span>
            <span class="toc-bar"></span>
        `;

        item.addEventListener("click", () => {
            const targetCard = document.querySelector(`[data-episode-id="${episode.id}"]`);
            if (targetCard) {
                targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });

        tocList.appendChild(item);
    });

    setupScrollSpy();
}

// Dynamically highlights the active TOC bar based on viewport scroll position
function setupScrollSpy() {
    const handleScroll = () => {
        const tocItems = document.querySelectorAll(".toc-item");
        let currentActiveId = null;

        tocItems.forEach(item => {
            const episodeId = item.dataset.tocId;
            const targetCard = document.querySelector(`[data-episode-id="${episodeId}"]`);

            if (targetCard) {
                const rect = targetCard.getBoundingClientRect();
                // Check if target card has reached the upper half of the viewport
                if (rect.top <= window.innerHeight * 0.45) {
                    currentActiveId = episodeId;
                }
            }
        });

        if (currentActiveId) {
            tocItems.forEach(item => {
                item.classList.toggle("active", item.dataset.tocId === currentActiveId);
            });
        }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
}