// backend/app.js
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);

module.exports = app;

const ticketRoutes = require('./routes/ticketRoutes');
app.use('/api/tickets', ticketRoutes);
