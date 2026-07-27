function calculateProductSum() {
    let n1 = document.getElementById("n1").value;
    let n2 = document.getElementById("n2").value;

    // Pad shorter number with leading zeros
    let maxLength = Math.max(n1.length, n2.length);
    n1 = n1.padStart(maxLength, '0');
    n2 = n2.padStart(maxLength, '0');

    let sum = 0;
    for (let i = 0; i < maxLength; i++) {
        let digit1 = parseInt(n1.charAt(i));
        let digit2 = parseInt(n2.charAt(i));
        sum += digit1 * digit2;
    }

    document.getElementById("result").textContent = `Result: ${sum}`;
}
