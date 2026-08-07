// Regenerates episodes/episodes.json by scanning the episodes/ folder for
// episode-XX subfolders, so it never has to be hand-edited again.
//
// Run from the project root with:
//     node tools/generate-episodes-json.js
//
// Re-run it any time you add or remove an episode folder.

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const EPISODES_DIR = path.join(PROJECT_ROOT, "episodes");
const OUTPUT_FILE = path.join(EPISODES_DIR, "episodes.json");

function main() {
    if (!fs.existsSync(EPISODES_DIR)) {
        console.error(`Could not find episodes folder at: ${EPISODES_DIR}`);
        process.exit(1);
    }

    const entries = fs.readdirSync(EPISODES_DIR, { withFileTypes: true });

    const episodeIds = entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name.match(/^episode-(\d+)$/))
        .filter(Boolean)
        .map(match => Number(match[1]))
        .filter(id => {
            const folderName = `episode-${String(id).padStart(2, "0")}`;
            const metadataPath = path.join(EPISODES_DIR, folderName, "metadata.json");
            const exists = fs.existsSync(metadataPath);
            if (!exists) {
                console.warn(`Skipping ${folderName}: no metadata.json found`);
            }
            return exists;
        })
        .sort((a, b) => a - b);

    if (episodeIds.length === 0) {
        console.error("No valid episode folders found. Nothing was written.");
        process.exit(1);
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(episodeIds, null, 4) + "\n");

    console.log(`Wrote ${episodeIds.length} episode id(s) to ${OUTPUT_FILE}`);
    console.log(episodeIds.join(", "));
}

main();