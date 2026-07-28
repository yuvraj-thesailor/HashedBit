// Function to reverse a string
function reverseString(str) {
    return str.split("").reverse().join("");
}

const originalText = document.getElementById("original").textContent;
const reversedText = reverseString(originalText);

document.getElementById("reversed").textContent = reversedText;
