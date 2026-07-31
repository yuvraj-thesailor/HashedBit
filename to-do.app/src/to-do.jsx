import { useState } from "react";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const addTask = () => {
    const trimmed = inputValue.trim();

    if (!trimmed) {
      setError("Please enter a task before adding.");
      return;
    }

    // Prevent duplicate tasks (case-insensitive) - UX improvement
    const isDuplicate = tasks.some(
      (task) => task.text.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setError("This task already exists in your list.");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: trimmed,
    };

    // Insert and keep list sorted in ascending (alphabetical) order
    const updatedTasks = [...tasks, newTask].sort((a, b) =>
      a.text.localeCompare(b.text, undefined, { sensitivity: "base" })
    );

    setTasks(updatedTasks);
    setInputValue(""); // clear field on successful addition
    setError("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleKeyDown = (e) => {
    // UX improvement: allow pressing Enter to add a task
    if (e.key === "Enter") {
      addTask();
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    if (error) setError("");
  };

  return (
    <div style={{ maxWidth: "480px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Todo List</h1>

      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
        <input
          id="task-input"
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter a new task"
          aria-label="New task"
        />
        <button id="add-task-btn" onClick={addTask}>
          Add
        </button>
      </div>

      {error && (
        <p style={{ color: "red", margin: "4px 0" }} role="alert">
          {error}
        </p>
      )}

      {tasks.length === 0 ? (
        <p>No tasks yet. Add one above!</p>
      ) : (
        <ul id="task-list">
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "4px 0",
              }}
            >
              <span>{task.text}</span>
              <button
                data-task-id={task.id}
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete task: ${task.text}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {tasks.length > 0 && (
        <p style={{ fontSize: "0.85em", color: "#666" }}>
          {tasks.length} task{tasks.length !== 1 ? "s" : ""} remaining
        </p>
      )}
    </div>
  );
}
