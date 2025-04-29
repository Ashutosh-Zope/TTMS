
// backend/routes/userRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getAllUsers,
  promoteUser,
  getAllDepartments,
  updateUserDepartments,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// Public auth routes
router.post("/signup", registerUser);
router.post("/login", loginUser);

// Password reset workflow
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Departments listing & assignment
router.get("/departments", getAllDepartments);
router.patch("/departments/:email", updateUserDepartments);

// Admin user management
router.get("/users", getAllUsers);
router.post("/promote/:email", promoteUser);
router.delete("/:email", deleteUser);


module.exports = router;
