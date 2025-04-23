// backend/routes/userRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  getAllUsers,
  promoteUser,
} = require("../controllers/userController");

const router = express.Router();

// public
router.post("/signup",       registerUser);
router.post("/login",        loginUser);
router.post("/forgot-password", forgotPassword);

// admin APIs
router.get("/users", getAllUsers);
router.post("/promote/:email", promoteUser);

module.exports = router;