// backend/controllers/userController.js

const dynamoDB = require("../config/dynamo");
const TABLE_NAME = "TicketSystem-Users";

// Register new user
exports.registerUser = async (req, res) => {
  console.log("--- registerUser ---", req.body);
  const { name, email, password, phone } = req.body;

  // Use userId instead of email as the partition key
  const getParams = { TableName: TABLE_NAME, Key: { userId: email } };
  console.log("getParams:", getParams);

  try {
    const existing = await dynamoDB.get(getParams).promise();
    console.log("existing:", existing);
    if (existing.Item) {
      return res.status(400).json({ message: "User already exists" });
    }

    const putParams = {
      TableName: TABLE_NAME,
      Item: {
        userId: email,
        name,
        password,
        phone,
        createdAt: new Date().toISOString(),
      },
    };
    console.log("putParams:", putParams);

    await dynamoDB.put(putParams).promise();
    res
      .status(201)
      .json({ message: "User registered successfully", userId: email });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  console.log("--- loginUser ---", req.body);
  const { email, password } = req.body;

  const getParams = { TableName: TABLE_NAME, Key: { userId: email } };
  console.log("getParams:", getParams);

  try {
    const result = await dynamoDB.get(getParams).promise();
    console.log("result:", result);

    const user = result.Item;
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", userId: email });
  } catch (err) {
    console.error("loginUser error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  console.log("--- forgotPassword ---", req.body);
  const { email } = req.body;

  const getParams = { TableName: TABLE_NAME, Key: { userId: email } };
  console.log("getParams:", getParams);

  try {
    const result = await dynamoDB.get(getParams).promise();
    console.log("result:", result);

    if (!result.Item) {
      return res.status(400).json({ message: "No user found with that email" });
    }

    res
      .status(200)
      .json({ message: "Password reset instructions sent (placeholder)" });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
