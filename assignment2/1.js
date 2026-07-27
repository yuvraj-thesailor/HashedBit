const container = document.getElementById("even-numbers");

for (let i = 2; i <= 100; i+=2) {
        const numberElement = document.createElement("p");
        numberElement.textContent = i;
        container.appendChild(numberElement);
}
