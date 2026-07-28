const createButton = document.getElementById("createDivBtn");
const container = document.getElementById("container");

createButton.addEventListener("click", () => {
    const newDiv = document.createElement("div");
    newDiv.classList.add("created-div");
    newDiv.textContent = "I am a new div created with JS!";
    container.appendChild(newDiv);
});
