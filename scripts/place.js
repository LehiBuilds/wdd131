// Run the calculation when the page loads
window.addEventListener("DOMContentLoaded", () => {
    // Values that satisfy the wind chill requirements
    const tempC = 5;
    const windKmH = 15;

    const tempF = 41;
    const windMph = 10;

    let displayC = "N/A";
    let displayF = "N/A";

    // Only call the function if the conditions are met
    if (tempC <= 10 && windKmH > 4.8) {
        displayC = `${calculateWindChill(tempC, windKmH, "C")}°C`;
    }

    if (tempF <= 50 && windMph > 3) {
        displayF = `${calculateWindChill(tempF, windMph, "F")}°F`;
    }

    document.getElementById("wind-chill-value").textContent =
        `${displayC} / ${displayF}`;
});

// One-line arrow function
const calculateWindChill = (temp, speed, unit) => unit === "F" ? Math.round(35.74 + 0.6215 * temp - 35.75 * Math.pow(speed, 0.16) + 0.4275 * temp * Math.pow(speed, 0.16)) : Math.round(13.12 + 0.6215 * temp - 11.37 * Math.pow(speed, 0.16) + 0.3965 * temp * Math.pow(speed, 0.16));

// footer content
const year = document.querySelector("#currentyear");
const today = new Date();

year.innerHTML = `${today.getFullYear()}`;

document.getElementById("lastModified").innerHTML = document.lastModified;