const express = require("express");
const cors = require("cors");

const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/bookings", bookingRoutes);

// 404 for anything else
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Centralized error handler - catches anything passed to next(err)
app.use((err, req, res, next) => {
  console.error(err);

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ message: "Duplicate entry" });
  }

  res.status(500).json({ message: "Something went wrong on the server" });
});

module.exports = app;
