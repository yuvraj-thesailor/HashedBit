function correctFn(string, wrong, correct) {
    return string.replace(wrong, correct);
}

function runCorrection() {
    const sentence = document.getElementById("sentence").value;
    const wrong = document.getElementById("wrong").value;
    const correct = document.getElementById("correct").value;

    const result = correctFn(sentence, wrong, correct);
    document.getElementById("result").textContent = result;
}
