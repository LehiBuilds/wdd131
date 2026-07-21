export const Icons = {

    collection(size = 14, className = "") {
        return `
            <svg
                class="${className}"
                width="${size}"
                height="${size}"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">

                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>

            </svg>
        `;
    },

    artwork(size = 40, className = "") {
        return `
            <svg
                class="${className}"
                width="${size}"
                height="${size}"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round">

                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>

            </svg>
        `;
    },

    skipBackward(size = 18, className = "") {
        return `
            <svg
                class="${className}"
                width="${size}"
                height="${size}"
                viewBox="0 0 24 24"
                fill="currentColor">

                <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"></path>

            </svg>
        `;
    },

    play(size = 20, className = "") {
        return `
            <svg
                class="${className}"
                width="${size}"
                height="${size}"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">

                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>

            </svg>
        `;
    },

    pause(size = 20, className = "") {
        return `
            <svg
                class="${className}"
                width="${size}"
                height="${size}"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">

                <circle cx="12" cy="12" r="10"></circle>
                <line x1="10" y1="15" x2="10" y2="9"></line>
                <line x1="14" y1="15" x2="14" y2="9"></line>

            </svg>
        `;
    },

    skipForward(size = 18, className = "") {
        return `
            <svg
                class="${className}"
                width="${size}"
                height="${size}"
                viewBox="0 0 24 24"
                fill="currentColor">

                <path d="M13 6v12l8.5-6L13 6zM4 18l8.5-6L4 6v12z"></path>

            </svg>
        `;
    },

    listen(size = 18, className = "") {
        return `
            <svg
                class="${className}"
                width="${size}"
                height="${size}"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">

                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"></path>
                <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>

            </svg>
        `;
    },

    transcript(size = 18, className = "") {
        return `
            <svg
                class="${className}"
                width="${size}"
                height="${size}"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">

                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>

            </svg>
        `;
    }

};