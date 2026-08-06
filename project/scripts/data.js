export async function loadEpisode(episodeId) {
    const formattedId = String(episodeId).padStart(2, "0");
    const basePath = `episodes/episode-${formattedId}`;

    try {
        const metadataResponse = await fetch(`${basePath}/metadata.json`);
        const metadata = await metadataResponse.json();

        const transcriptFileName = metadata.transcript || "transcript.json";
        const transcriptResponse = await fetch(`${basePath}/${transcriptFileName}`);
        const transcriptData = await transcriptResponse.json();

        let syncData = null;
        const syncFileName = metadata.transcriptSync || "sync.json";

        try {
            const syncResponse = await fetch(`${basePath}/${syncFileName}`);
            if (syncResponse.ok) {
                syncData = await syncResponse.json();
            }
        } catch {
            try {
                const fallbackSync = await fetch(`${basePath}/sync.json`);
                if (fallbackSync.ok) {
                    syncData = await fallbackSync.json();
                }
            } catch {
                console.warn(`Sync data missing for episode ${episodeId}`);
            }
        }

        const paragraphs = buildParagraphs(transcriptData, syncData);

        // Evaluates to true if start/end timestamps are present and valid
        const hasSync = paragraphs.some(p => typeof p.start === "number" && typeof p.end === "number" && p.end > 0);

        return {
            id: episodeId,
            metadata,
            paragraphs,
            hasSync,
            audioPath: `${basePath}/${metadata.audio || "audio.m4a"}`
        };
    } catch (error) {
        console.error(`Failed to load episode ${episodeId}:`, error);
        throw error;
    }
}

function buildParagraphs(transcriptData, syncData) {
    const rawParagraphs = Array.isArray(transcriptData)
        ? transcriptData
        : transcriptData.paragraphs || [];

    return rawParagraphs.map((p, index) => {
        let start = p.start ?? 0;
        let end = p.end ?? 0;

        const syncParagraph = syncData?.paragraphs?.[index];
        if (syncParagraph) {
            start = syncParagraph.start ?? start;
            end = syncParagraph.end ?? end;
        }

        return {
            number: index + 1,
            text: typeof p === "string" ? p : p.text,
            start,
            end
        };
    });
}

export async function loadArchiveEpisode(id) {
    const episodeNumber = String(id).padStart(2, "0");
    const folder = `episodes/episode-${episodeNumber}`;
    const metadata = await loadMetadata(folder);

    return {
        id,
        metadata,
        audioPath: `${folder}/${metadata.audio || "audio.m4a"}`
    };
}

async function loadMetadata(folder) {
    const response = await fetch(`${folder}/metadata.json`);
    if (!response.ok) {
        throw new Error(`Could not load metadata from ${folder}`);
    }
    return await response.json();
}

export async function loadEpisodeList() {
    const response = await fetch("episodes/episodes.json");
    if (!response.ok) {
        throw new Error("Could not load episode list");
    }

    const episodeIds = await response.json();
    return await Promise.all(
        episodeIds.map(id => loadArchiveEpisode(id))
    );
}