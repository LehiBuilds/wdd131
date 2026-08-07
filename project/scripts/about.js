import { Storage } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
    setupMobileNav();
    renderStorageTable("storage-table-container");
});

function renderStorageTable(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const state = Storage.loadSavedState();

    const tableData = [
        { property: "Last Listened Episode", value: state.lastEpisodeTitle },
        { property: "Playback Position", value: Storage.formatTime(state.playbackTime) },
        { property: "Volume Level", value: `${Math.round(state.volume * 100)}%` },
        { property: "Last Active Session", value: state.lastVisited }
    ];

    let tableHTML = `
        <table class="storage-table" style="width: 100%; border-collapse: collapse; margin-top: 1rem; background: var(--color-surface-container); border: 1px solid var(--color-border); border-radius: 8px; overflow: hidden;">
            <thead>
                <tr style="background: rgba(255, 255, 255, 0.05); border-bottom: 1px solid var(--color-border); text-align: left;">
                    <th style="padding: 0.75rem 1rem; color: var(--color-accent); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Property</th>
                    <th style="padding: 0.75rem 1rem; color: var(--color-accent); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Value</th>
                </tr>
            </thead>
            <tbody>
    `;

    tableData.forEach((row, index) => {
        const isLast = index === tableData.length - 1;
        tableHTML += `
            <tr style="${!isLast ? 'border-bottom: 1px solid var(--color-border);' : ''}">
                <td style="padding: 0.75rem 1rem; color: var(--color-text); font-weight: 500; font-size: 0.9rem;">${row.property}</td>
                <td style="padding: 0.75rem 1rem; color: var(--color-text-secondary); font-size: 0.9rem;">${row.value}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    container.innerHTML = tableHTML;
}

function setupMobileNav() {
    const toggleBtn = document.getElementById("nav-toggle");
    const nav = document.querySelector("header nav");

    if (!toggleBtn || !nav) return;

    toggleBtn.addEventListener("click", () => {
        const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
        toggleBtn.setAttribute("aria-expanded", String(!isExpanded));
        nav.classList.toggle("open");

        const icon = toggleBtn.querySelector(".material-symbols-outlined");
        if (icon) {
            icon.textContent = isExpanded ? "menu" : "close";
        }
    });
}