/*
  JavaScript Assignment Solutions
  ===============================
*/

// ==========================================
// Question 1:
// Write a JavaScript function that declares a variable using let, const, and var.
// What is the difference in scope for each?
// ==========================================

function scopeDemo() {
  if (true) {
    var varVariable = "I am declared with var (Function-scoped)";
    let letVariable = "I am declared with let (Block-scoped)";
    const constVariable = "I am declared with const (Block-scoped)";

    console.log("Inside block:");
    console.log(varVariable);   // Accessible
    console.log(letVariable);   // Accessible
    console.log(constVariable); // Accessible
  }

  console.log("\nOutside block:");
  console.log(varVariable); // Accessible because var is function-scoped

  // Un-commenting the lines below will throw ReferenceErrors:
  // console.log(letVariable);   // ReferenceError: letVariable is not defined
  // console.log(constVariable); // ReferenceError: constVariable is not defined
}


// ==========================================
// Question 2:
// Create an array called fruits that contains five different fruit names.
// Write a function that returns the second fruit in the array.
// ==========================================
const fruits = ["Apple", "Banana", "Cherry", "Dragonfruit", "Elderberry"];

function getSecondFruit(fruitArray) {
  return fruitArray[1]; // Arrays are zero-indexed, so index 1 is the 2nd element
}


// ========================================
// Question 3:
// Write a function that takes an array as an argument, adds a new element to the end
// of the array using push(), and then removes the last element using pop().
// Return the modified array.
// ========================================
function modifyArray(arr, newElement) {
  arr.push(newElement); // Adds element to the end
  arr.pop();            // Removes the last element
  return arr;           // Returns the modified array
}


// ==========================================
// Question 4:
// Create an array of numbers and write a function that uses the map() method
// to return a new array containing each number squared.
// ========================================
const sampleNumbers = [1, 2, 3, 4, 5];

function squareNumbers(numbersArray) {
  return numbersArray.map(num => num * num);
}


// ==========================================
// Question 5:
// Write a function that filters out all even numbers from an array of numbers
// using the filter() method. Return the new array of odd numbers.
// ==========================================
function filterOddNumbers(numbersArray) {
  return numbersArray.filter(num => num % 2 !== 0);
}


// ==========================================
// Question 6:
// Create an object called person with properties for name, age, and occupation.
// Write a function that logs a greeting message using these properties.
// ==========================================
const person = {
  name: "Alex Morgan",
  age: 28,
  occupation: "Software Engineer"
};

function logGreeting(personObj) {
  console.log(`Hello! My name is ${personObj.name}, I am ${personObj.age} years old, and I work as a ${personObj.occupation}.`);
}


// ==========================================
// Question 7:
// Write a function that takes an object with properties width and height
// and returns the area of a rectangle (width * height).
// ==========================================
function calculateRectangleArea(rectangle) {
  return rectangle.width * rectangle.height;
}


// ==========================================
// Question 8:
// Given an object with various properties, write a function that returns
// an array of the object’s keys using Object.keys().
// ==========================================
function getObjectKeys(obj) {
  return Object.keys(obj);
}


// ==========================================
// Question 9:
// Write a function that takes two objects as arguments and merges them into
// one object using Object.assign(). Return the new object.
// ==========================================
function mergeObjects(obj1, obj2) {
  return Object.assign({}, obj1, obj2);
}


// ==========================================
// Question 10:
// Create an array of numbers and write a function that uses the reduce()
// method to calculate the sum of all the numbers in the array.
// ==========================================
const numbersForSum = [10, 20, 30, 40, 50];

function calculateSum(numbersArray) {
  return numbersArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}


// ==========================================
// Verification / Example Executions
// ==========================================
console.log("--- Q1: Scope Demo ---");
scopeDemo();

console.log("\n--- Q2: Second Fruit ---");
console.log("Second fruit:", getSecondFruit(fruits));

console.log("\n--- Q3: Push & Pop Array ---");
console.log("Modified array:", modifyArray(["A", "B", "C"], "D"));

console.log("\n--- Q4: Square Numbers ---");
console.log("Squared numbers:", squareNumbers(sampleNumbers));

console.log("\n--- Q5: Filter Odd Numbers ---");
console.log("Odd numbers:", filterOddNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

console.log("\n--- Q6: Person Greeting ---");
logGreeting(person);

console.log("\n--- Q7: Rectangle Area ---");
console.log("Area:", calculateRectangleArea({ width: 15, height: 8 }));

console.log("\n--- Q8: Object Keys ---");
console.log("Keys:", getObjectKeys(person));

console.log("\n--- Q9: Merge Objects ---");
console.log("Merged Object:", mergeObjects({ a: 1, b: 2 }, { c: 3, d: 4 }));

console.log("\n--- Q10: Sum using Reduce ---");
console.log("Sum:", calculateSum(numbersForSum));
