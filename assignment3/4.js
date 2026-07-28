const str = "Who am I without my thoughts"; // Minimum 20 characters

let vowels = 0;
let consonants = 0;

for (let i = 0; i < str.length; i++) {
    const ch = str[i].toLowerCase();
    if (ch >= 'a' && ch <= 'z') {
        if ('aeiou'.includes(ch)) {
            vowels++;
        } else {
            consonants++;
        }
    }
}

document.getElementById("input-string").textContent = "Input String: " + str;
document.getElementById("vowel-count").textContent = "Vowels: " + vowels;
document.getElementById("consonant-count").textContent = "Consonants: " + consonants;
