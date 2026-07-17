// Run the calculation when the page loads
window.addEventListener("DOMContentLoaded", () => {
    // 1. Static values matching the HTML content
    const tempC = 31;
    const windKmH = 13;

    const tempF = 88;
    const windMph = 8;

    // Variables to store final strings
    let displayC = "N/A";
    let displayF = "N/A";

    // 2. Conditional Checks: ONLY call the function if requirements are met
    if (tempC <= 10 && windKmH > 4.8) {
        displayC = `${calculateWindChill(tempC, windKmH, "C")}°C`;
    }

    if (tempF <= 50 && windMph > 3) {
        displayF = `${calculateWindChill(tempF, windMph, "F")}°F`;
    }

    // 3. Format the combined display string (e.g., "N/A / N/A")
    const displayValue = `${displayC} / ${displayF}`;

    // 4. Update the DOM element
    const windChillSpan = document.getElementById("wind-chill-value"); if (windChillSpan) {
        windChillSpan.textContent = displayValue;
    }
});

/**
 * Calculates the wind chill factor based on unit type.
 * Uses a single-line conditional (ternary) return statement.
 * Strictly performs calculation math since validation happens before calling.
 */
function calculateWindChill(temp, speed, unit) {
    return unit === "F"
        ? Math.round(35.74 + 0.6215 * temp - 35.75 * Math.pow(speed, 0.16) + 0.4275 * temp * Math.pow(speed, 0.16))
        : Math.round(13.12 + 0.6215 * temp - 11.37 * Math.pow(speed, 0.16) + 0.3965 * temp * Math.pow(speed, 0.16));
}













// footer content
const year = document.querySelector("#currentyear");
const today = new Date();

year.innerHTML = `${today.getFullYear()}`;

document.getElementById("lastModified").innerHTML = document.lastModified;