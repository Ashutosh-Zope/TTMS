// backend/controllers/userController.js
const User = require("../models/User");

// @desc   Register new user
// @route  POST /api/users/signup
// @access Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({ name, email, password, phone });
    res.status(201).json({
      message: "User created successfully",
      userId: newUser._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc   Login user
// @route  POST /api/users/login
// @access Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If valid, respond
    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc   Forgot password
// @route  POST /api/users/forgot-password
// @access Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found with that email" });
    }

    // Placeholder for sending reset link or process
    // e.g., generate token, email user a password reset link, etc.

    res.status(200).json({
      message: "Password reset instructions sent (placeholder)",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
