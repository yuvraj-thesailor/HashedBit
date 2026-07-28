const toggleBtn = document.getElementById("toggle-btn");

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {
        toggleBtn.textContent = "Switch to Light Theme";
    } else {
        toggleBtn.textContent = "Switch to Dark Theme";
    }
});
