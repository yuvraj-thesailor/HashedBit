const students = [
    {
        student1: {
            subject1: 44,
            subject2: 56,
            subject3: 87,
            subject4: 97,
            subject5: 37
        }
    },
    {
        student2: {
            subject1: 44,
            subject2: 56,
            subject3: 87,
            subject4: 97,
            subject5: 37
        }
    },
    {
        student3: {
            subject1: 44,
            subject2: 56,
            subject3: 87,
            subject4: 97,
            subject5: 37
        }
    }
];

const outputDiv = document.getElementById("output");

const averages = students.map(studentObj => {
    const key = Object.keys(studentObj)[0];
    const marks = Object.values(studentObj[key]);
    const sum = marks.reduce((acc, curr) => acc + curr, 0);
    const average = Math.round(sum / marks.length);
    return { [key]: { average: average } };
});

// Display in HTML
averages.forEach(student => {
    const key = Object.keys(student)[0];
    const avg = student[key].average;
    const p = document.createElement("p");
    p.textContent = `${key}: Average = ${avg}`;
    outputDiv.appendChild(p);
});

console.log(averages); // Optional: for developer use
