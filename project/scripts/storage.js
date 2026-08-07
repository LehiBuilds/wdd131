/**
 * LocalStorage Utility Module
 */
const STORAGE_PREFIX = 'pqcnm_';

export const STORAGE_KEYS = {
    LAST_EPISODE_TITLE: `${STORAGE_PREFIX}last_episode_title`,
    PLAYBACK_TIME: `${STORAGE_PREFIX}playback_time`,
    VOLUME: `${STORAGE_PREFIX}volume`,
    LAST_VISITED: `${STORAGE_PREFIX}last_visited`
};

export const Storage = {
    /**
     * Save the active episode title and timestamp.
     */
    savePlaybackState(title, currentTime) {
        try {
            if (title) {
                localStorage.setItem(STORAGE_KEYS.LAST_EPISODE_TITLE, title);
            }
            if (currentTime !== undefined && !isNaN(currentTime)) {
                localStorage.setItem(STORAGE_KEYS.PLAYBACK_TIME, currentTime.toFixed(1));
            }
            localStorage.setItem(STORAGE_KEYS.LAST_VISITED, new Date().toLocaleString());
        } catch (e) {
            console.warn('LocalStorage error saving playback state:', e);
        }
    },

    /**
     * Save audio volume setting.
     */
    saveVolume(volume) {
        try {
            localStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString());
        } catch (e) {
            console.warn('LocalStorage error saving volume:', e);
        }
    },

    /**
     * Read all active settings from LocalStorage.
     */
    loadSavedState() {
        try {
            return {
                lastEpisodeTitle: localStorage.getItem(STORAGE_KEYS.LAST_EPISODE_TITLE) || 'None',
                playbackTime: parseFloat(localStorage.getItem(STORAGE_KEYS.PLAYBACK_TIME)) || 0,
                volume: localStorage.getItem(STORAGE_KEYS.VOLUME) !== null
                    ? parseFloat(localStorage.getItem(STORAGE_KEYS.VOLUME))
                    : 1.0,
                lastVisited: localStorage.getItem(STORAGE_KEYS.LAST_VISITED) || 'First Visit'
            };
        } catch (e) {
            console.warn('LocalStorage error reading state:', e);
            return {
                lastEpisodeTitle: 'None',
                playbackTime: 0,
                volume: 1.0,
                lastVisited: 'First Visit'
            };
        }
    },

    /**
     * Format timestamp (seconds) into standard MM:SS string.
     */
    formatTime(seconds) {
        if (isNaN(seconds) || seconds <= 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
};