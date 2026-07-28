function repeatedDigitSum(num) {
    while (num >= 10) {
        let sum = 0;
        while (num > 0) {
            sum += num % 10;
            num = Math.floor(num / 10);
        }
        num = sum;
    }
    return num;
}

function calculateDigitSum() {
    const input = document.getElementById("numberInput").value;
    const number = parseInt(input);
    
    if (isNaN(number)) {
        document.getElementById("result").textContent = "Please enter a valid number.";
        return;
    }

    const result = repeatedDigitSum(number);
    document.getElementById("result").textContent = `Final single digit: ${result}`;
}
