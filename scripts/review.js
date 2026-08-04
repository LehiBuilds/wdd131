const year = document.querySelector("#currentyear");
const today = new Date();

let reviewCount = Number(localStorage.getItem("reviewCount")) || 0;

reviewCount++;

localStorage.setItem("reviewCount", reviewCount);

document.getElementById("reviewCount").textContent = reviewCount;
year.textContent = today.getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;
