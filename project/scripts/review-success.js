document.addEventListener("DOMContentLoaded", () => {
    const data = JSON.parse(sessionStorage.getItem("submittedReview"));
    if (!data) {
        window.location.href = "contact.html";
        return;
    }

    document.getElementById("prev-subject").textContent = data.subject;
    document.getElementById("prev-rating").innerHTML = "★".repeat(parseInt(data.rating)) + "☆".repeat(5 - parseInt(data.rating));
    document.getElementById("prev-focus").textContent = data.focus;
    document.getElementById("prev-message").textContent = data.message;
    document.getElementById("prev-name").textContent = data.name;
    document.getElementById("prev-email").textContent = data.email;
});