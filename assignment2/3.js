function findTax(salary) {
    let tax = 0;

    switch (true) {
        case (salary > 0 && salary <= 500000):
            tax = 0;
            break;
        case (salary > 500000 && salary <= 1000000):
            tax = salary * 0.10;
            break;
        case (salary > 1000000 && salary <= 1500000):
            tax = salary * 0.20;
            break;
        case (salary > 1500000):
            tax = salary * 0.30;
            break;
        default:
            tax = "Invalid salary";
    }

    return tax;
}

function calculateTax() {
    const salaryInput = document.getElementById("salary").value;
    const salary = parseFloat(salaryInput);
    const resultPara = document.getElementById("result");

    if (isNaN(salary) || salary < 0) {
        resultPara.textContent = "Please enter a valid salary amount.";
    } else {
        const taxAmount = findTax(salary);
        resultPara.textContent = `Tax on ₹${salary} is ₹${taxAmount}`;
    }
}
