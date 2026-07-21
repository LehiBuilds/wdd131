export function renderEpisodeList(episodes) {
    const container =
        document.getElementById("episode-list");

    container.innerHTML = "";

    episodes.forEach(episode => {
        const article =
            document.createElement("article");
        article.className = "episode-card";
        article.innerHTML = `
        <h3>${episode.metadata.title}</h3>
        
        <p>${episode.metadata.date}</p>
        
        <p>${episode.metadata.duration}</p>
        `;

        container.appendChild(article);
    });
}