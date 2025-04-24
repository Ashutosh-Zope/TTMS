const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔍 Global Request Logger
app.use((req, res, next) => {
  console.log(`📦 ${req.method} ${req.url}`);
  next();
});

// 🔧 Test Route
app.get('/test', (req, res) => {
  console.log("✅ /test endpoint hit");
  res.send("Backend is alive!");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);

module.exports = app;
