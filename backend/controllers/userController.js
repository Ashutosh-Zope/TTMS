// backend/controllers/userController.js
const dynamoDB   = require("../config/dynamo");
const USERS_TBL  = "TicketSystem-Users";
const ADMINS_TBL = "TicketSystem-Admins";

// Register new user
exports.registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const getParams = { TableName: USERS_TBL, Key: { userId: email } };

  try {
    const existing = await dynamoDB.get(getParams).promise();
    if (existing.Item) {
      return res.status(400).json({ message: "User already exists" });
    }
    const putParams = {
      TableName: USERS_TBL,
      Item: {
        userId:    email,
        name,
        password,
        phone,
        createdAt: new Date().toISOString(),
      },
    };
    await dynamoDB.put(putParams).promise();
    res
      .status(201)
      .json({ message: "User registered successfully", userId: email });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login user or admin
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1) Try Admins table
    const adminRes = await dynamoDB
      .get({ TableName: ADMINS_TBL, Key: { email } })
      .promise();
    if (adminRes.Item && adminRes.Item.password === password) {
      return res
        .status(200)
        .json({ message: "Login successful", userId: email, role: "admin" });
    }

    // 2) Fallback to Users table
    const userRes = await dynamoDB
      .get({ TableName: USERS_TBL, Key: { userId: email } })
      .promise();
    if (userRes.Item && userRes.Item.password === password) {
      return res
        .status(200)
        .json({ message: "Login successful", userId: email, role: "user" });
    }

    // 3) No match
    return res.status(400).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("loginUser error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const getParams = { TableName: USERS_TBL, Key: { userId: email } };

  try {
    const result = await dynamoDB.get(getParams).promise();
    if (!result.Item) {
      return res
        .status(400)
        .json({ message: "No user found with that email" });
    }
    res
      .status(200)
      .json({ message: "Password reset instructions sent (placeholder)" });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// List all users (for admin)
exports.getAllUsers = async (req, res) => {
  try {
    const data = await dynamoDB.scan({ TableName: USERS_TBL }).promise();

    // remap userId → email for the front-end
    const items = data.Items.map(item => ({
      email:     item.userId,
      name:      item.name,
      phone:     item.phone,
      createdAt: item.createdAt
    }));

    res.status(200).json(items);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Promote a user to admin
exports.promoteUser = async (req, res) => {
  const { email } = req.params;
  try {
    // fetch from Users table
    const { Item: user } = await dynamoDB
      .get({ TableName: USERS_TBL, Key: { userId: email } })
      .promise();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // write to Admins table
    await dynamoDB.put({
      TableName: ADMINS_TBL,
      Item: {
        email,
        name:       user.name,
        password:   user.password,
        phone:      user.phone,
        promotedAt: new Date().toISOString(),
      },
    }).promise();

    // remove from Users table
    await dynamoDB
      .delete({ TableName: USERS_TBL, Key: { userId: email } })
      .promise();

    res
      .status(200)
      .json({ message: "User promoted to admin", userId: email });
  } catch (err) {
    console.error("promoteUser error:", err);
    res.status(500).json({ message: "Promotion failed", error: err.message });
  }
};