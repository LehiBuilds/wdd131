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
    const stars = document.querySelectorAll(".star-rating-icon");
    const ratingInput = document.getElementById("selected-rating");

    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            const ratingValue = index + 1;
            if (ratingInput) {
                ratingInput.value = ratingValue;
            }

            stars.forEach((s, sIndex) => {
                if (sIndex < ratingValue) {
                    s.classList.add("active");
                } else {
                    s.classList.remove("active");
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

        submitBtn.textContent = "SUBMITTING REVIEW...";
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = "REVIEW SUBMITTED";

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                form.reset();

                // Reset star ratings back to default (3 stars)
                const stars = document.querySelectorAll(".star-rating-icon");
                const ratingInput = document.getElementById("selected-rating");
                if (ratingInput) ratingInput.value = "3";

                stars.forEach((star, index) => {
                    if (index < 3) {
                        star.classList.add("active");
                    } else {
                        star.classList.remove("active");
                    }
                });
            }, 2500);
        }, 1200);
    });
}