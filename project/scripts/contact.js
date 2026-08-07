document.addEventListener("DOMContentLoaded", () => {
    setupMobileNav();
    setupStarRating();
    setupCheckboxValidation();
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

function setupCheckboxValidation() {
    const checkboxes = document.querySelectorAll(".category-checkbox");
    if (checkboxes.length === 0) return;

    const updateCheckboxRequirements = () => {
        const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
        checkboxes.forEach(cb => {
            cb.required = !anyChecked;
        });
    };

    updateCheckboxRequirements();
    checkboxes.forEach(cb => cb.addEventListener("change", updateCheckboxRequirements));
}

function setupContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector(".submit-btn");
        submitBtn.textContent = "TRANSMITTING...";
        submitBtn.disabled = true;

        // Collect form values
        const selectedCategories = Array.from(document.querySelectorAll(".category-checkbox:checked"))
            .map(cb => cb.value);

        const formData = {
            subject: document.getElementById("subject").value,
            rating: document.getElementById("selected-rating").value,
            focus: selectedCategories.length > 0 ? selectedCategories.join(", ") : "None specified",
            message: document.getElementById("message").value,
            name: document.getElementById("full-name").value.trim() || "Anonymous",
            email: document.getElementById("email").value.trim() || "Not provided"
        };

        // Save to sessionStorage and redirect to dedicated success page
        sessionStorage.setItem("submittedReview", JSON.stringify(formData));

        setTimeout(() => {
            window.location.href = "review-success.html";
        }, 1000);
    });
}