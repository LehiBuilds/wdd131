export async function loadEpisode(id) {

    const episodeNumber = String(id).padStart(2, "0");
    const folder = `episodes/episode-${episodeNumber}`;

    // const metadata = await loadMetadata(folder);
    // const transcript = await loadTranscript(folder);
    // const sync = await loadSync(folder);

    // return {
    //     id,
    //     metadata,
    //     transcript,
    //     sync,
    //     audioPath: `${folder}/${metadata.audio}`
    // };

    const metadata = await loadMetadata(folder);
    const transcript = await loadTranscript(folder);
    const sync = await loadSync(folder);

    const paragraphs = transcript.paragraphs.map((paragraph, index) => ({
        ...paragraph,
        ...sync.paragraphs[index]
    }));

    return {
        id,
        metadata,
        audioPath: `${folder}/${metadata.audio}`,
        paragraphs
    };

}
async function loadMetadata(folder) {
    const response = await fetch(`${folder}/metadata.json`);
    if (!response.ok) {
        throw new Error(`Could not load metadata from ${folder}`);
    }
    return await response.json();
}

async function loadTranscript(folder) {
    const response = await fetch(`${folder}/transcript.json`);

    if (!response.ok) {
        throw new Error(`Could not load transcript from ${folder}`);
    }
    return await response.json();
}

async function loadSync(folder) {
    const response = await fetch(`${folder}/sync.json`);
    if (!response.ok) {
        throw new Error(`Could not load sync data from ${folder}`);
    }
    return await response.json();
}

export async function loadEpisodeList() {
    const episodes = [];

    for (let id = 1; id <= 5; id++) {
        const episode =
            await loadEpisode(id);

        episodes.push({
            id: episode.id,
            metadata: episode.metadata
        });
    }
    return episodes;
}