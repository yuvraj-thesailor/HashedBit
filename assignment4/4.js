const btn = document.getElementById("create-box");
const container = document.getElementById("box-container");

btn.addEventListener("click", () => {
    const box = document.createElement("div");
    box.classList.add("dynamic-box");

    // Set styles dynamically using JS
    box.style.width = "100px";
    box.style.height = "100px";
    box.style.backgroundColor = getRandomColor();
    box.style.border = "2px solid black";
    box.style.borderRadius = "8px";

    container.appendChild(box);
});

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
