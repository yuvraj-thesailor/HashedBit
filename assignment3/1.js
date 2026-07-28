const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

// Filter out states that start with a vowel
const filteredStates = states.filter(state => {
    const firstLetter = state.charAt(0).toLowerCase();
    return !"aeiou".includes(firstLetter);
});

// Display the filtered list
const listElement = document.getElementById("state-list");

filteredStates.forEach(state => {
    const li = document.createElement("li");
    li.textContent = state;
    listElement.appendChild(li);
});
