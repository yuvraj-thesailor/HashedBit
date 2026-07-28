const toggleBtn = document.getElementById("toggleBtn");
const myPara = document.getElementById("myPara");

toggleBtn.addEventListener("click", () => {
    if (myPara.style.display === "none") {
        myPara.style.display = "block";
        toggleBtn.textContent = "Hide";
    } else {
        myPara.style.display = "none";
        toggleBtn.textContent = "Show";
    }
});
