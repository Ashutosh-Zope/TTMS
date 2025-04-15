// backend/routes/userRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);

module.exports = router;
