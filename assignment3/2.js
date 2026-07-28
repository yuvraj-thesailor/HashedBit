let str = 'I love my India';

document.getElementById("original").textContent = str;

let reversed = str.split(' ').reverse().join(' ');

document.getElementById("reversed").textContent = reversed;
