document.addEventListener("DOMContentLoaded", () => {
    setupMobileNav();
    setupStarRating();
    setupContactForm();
});

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

function setupStarRating() {
    const items = document.querySelectorAll(".star-rating-item");

    items.forEach((item, index) => {
        const starIcon = item.querySelector(".material-symbols-outlined");
        const radio = item.querySelector("input[type='radio']");

        item.addEventListener("click", () => {
            radio.checked = true;
            items.forEach((sItem, sIndex) => {
                const icon = sItem.querySelector(".material-symbols-outlined");
                if (sIndex <= index) {
                    icon.classList.add("active");
                } else {
                    icon.classList.remove("active");
                }
            });
        });
    });
}

function setupContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector(".submit-btn");
        const originalText = submitBtn.textContent;

        submitBtn.textContent = "TRANSMITTING...";
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = "MESSAGE SENT";

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                form.reset();

                // Reset stars
                document.querySelectorAll(".star-rating-item .material-symbols-outlined").forEach((icon, index) => {
                    if (index < 3) {
                        icon.classList.add("active");
                    } else {
                        icon.classList.remove("active");
                    }
                });
            }, 2500);
        }, 1200);
    });
}