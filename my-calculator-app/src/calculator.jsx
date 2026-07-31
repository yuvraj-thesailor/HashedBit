import React, { useState } from "react";

export default function Calculator() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const getNumbers = () => {
    const a = parseFloat(num1);
    const b = parseFloat(num2);
    if (Number.isNaN(a) || Number.isNaN(b)) {
      setError("Please enter valid numbers in both fields.");
      return null;
    }
    setError("");
    return { a, b };
  };

  const handleAdd = () => {
    const nums = getNumbers();
    if (nums) setResult(nums.a + nums.b);
  };

  const handleSubtract = () => {
    const nums = getNumbers();
    if (nums) setResult(nums.a - nums.b);
  };

  const handleMultiply = () => {
    const nums = getNumbers();
    if (nums) setResult(nums.a * nums.b);
  };

  const handleDivide = () => {
    const nums = getNumbers();
    if (nums) {
      if (nums.b === 0) {
        setError("Cannot divide by zero.");
        setResult(null);
      } else {
        setResult(nums.a / nums.b);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Calculator</h2>

      <div style={styles.inputGroup}>
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          placeholder="Enter first number"
          style={styles.input}
        />
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          placeholder="Enter second number"
          style={styles.input}
        />
      </div>

      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={handleAdd}>+</button>
        <button style={styles.button} onClick={handleSubtract}>−</button>
        <button style={styles.button} onClick={handleMultiply}>×</button>
        <button style={styles.button} onClick={handleDivide}>÷</button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.outputBox}>
        Result: {result !== null && !error ? result : "—"}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 320,
    margin: "40px auto",
    padding: 24,
    borderRadius: 12,
    border: "1px solid #ddd",
    fontFamily: "sans-serif",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  heading: {
    marginBottom: 16,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 16,
  },
  input: {
    padding: "8px 10px",
    fontSize: 14,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  buttonGroup: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
    marginBottom: 16,
  },
  button: {
    padding: "10px 0",
    fontSize: 18,
    borderRadius: 6,
    border: "1px solid #ccc",
    cursor: "pointer",
    background: "#f5f5f5",
  },
  error: {
    color: "#c0392b",
    fontSize: 13,
    marginBottom: 10,
  },
  outputBox: {
    padding: "12px 0",
    fontSize: 16,
    fontWeight: 500,
    background: "#f0f4ff",
    borderRadius: 6,
  },
};
