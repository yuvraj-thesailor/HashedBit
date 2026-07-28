const inputArr = [1, 2, 3, 9, 10, 7, 5, 4, 3];

// Filter numbers greater than 5
const answer = inputArr.filter(num => num > 5);

// Display the result in the HTML page
const resultDiv = document.getElementById("result");
resultDiv.textContent = `Filtered numbers: ${answer.join(', ')}`;
