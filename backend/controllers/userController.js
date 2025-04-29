// backend/controllers/userController.js
const dynamoDB      = require("../config/dynamo");
const { sendEmail } = require("../utils/ses");
const { v4: uuidv4 } = require("uuid");

const USERS_TBL  = "TicketSystem-Users";
const ADMINS_TBL = "TicketSystem-Admins";
const DEPTS_TBL  = "TicketSystem-Departments";

// 1) Register new user
exports.registerUser = async (req, res) => {
  const { name, email, password, phone, departmentIds = [] } = req.body;
  const getParams = { TableName: USERS_TBL, Key: { userId: email } };

  try {
    const existing = await dynamoDB.get(getParams).promise();
    if (existing.Item) {
      return res.status(400).json({ message: "User already exists" });
    }

    const putParams = {
      TableName: USERS_TBL,
      Item: {
        userId:        email,      
        name,
        password,
        phone,
        departmentIds,
        createdAt:     new Date().toISOString(),
      },
    };

    await dynamoDB.put(putParams).promise();

    // send welcome email
    await sendEmail(
      email,
     "Welcome to TTMS!",
    `<p>Hi ${name},</p>
     <p>Thanks for creating an account on our Ticket Tracking system! Feel free to open your first ticket.</p>`
  );

    res
      .status(201)
      .json({ message: "User registered successfully", userId: email });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 2) Login user or admin
exports.loginUser = async (req, res) => {
  console.log("🔑 loginUser called with:", req.body);
  const { email, password } = req.body;

  try {
    // check admins first
    const adminRes = await dynamoDB
      .get({ TableName: ADMINS_TBL, Key: { userId: email } })
      .promise();

    if (adminRes.Item && adminRes.Item.password === password) {
      return res
        .status(200)
        .json({ message: "Login successful", userId: email, role: "admin" });
    }

    // fallback to users
    const userRes = await dynamoDB
      .get({ TableName: USERS_TBL, Key: { userId: email } })
      .promise();

    if (userRes.Item && userRes.Item.password === password) {
      // send login-notification email
      await sendEmail(
        email,
        "New login to your TTMS account",
        `<p>Hi ${userRes.Item.name},</p>
         <p>You just logged in at ${new Date().toLocaleString()}.</p>`
      );

      return res
        .status(200)
        .json({ message: "Login successful", userId: email, role: "user" });
    }

    return res.status(400).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("loginUser error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 3) Forgot password — send code
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const { Item: user } = await dynamoDB
      .get({ TableName: USERS_TBL, Key: { userId: email } })
      .promise();

    if (!user) {
      return res.status(404).json({ message: "No user with that email" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await dynamoDB.update({
      TableName: USERS_TBL,
      Key: { userId: email },
      UpdateExpression: "SET resetCode = :c, resetExpires = :e",
      ExpressionAttributeValues: {
        ":c": code,
        ":e": expires
      }
    }).promise();

    await sendEmail(
      email,
      "Your TTMS password reset code",
      `<p>Your code is <strong>${code}</strong>. It expires in 15 minutes.</p>`
    );

    res.json({ message: "Reset code sent" });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 4) Reset password
exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const { Item: user } = await dynamoDB
      .get({ TableName: USERS_TBL, Key: { userId: email } })
      .promise();

    if (!user) {
      return res.status(404).json({ message: "No such user" });
    }

    if (user.resetCode !== code || new Date() > new Date(user.resetExpires)) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    await dynamoDB.update({
      TableName: USERS_TBL,
      Key: { userId: email },
      UpdateExpression: "SET password = :p REMOVE resetCode, resetExpires",
      ExpressionAttributeValues: { ":p": newPassword }
    }).promise();

    await sendEmail(
      email,
      "TTMS password reset successful",
      "<p>Your password has been updated. If this wasn’t you, please contact support.</p>"
    );

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 5) List all users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const data = await dynamoDB.scan({ TableName: USERS_TBL }).promise();

    const items = data.Items.map(item => ({
      email:        item.userId,
      name:         item.name,
      phone:        item.phone,
      createdAt:    item.createdAt,
      departmentIds: item.departmentIds || []
    }));

    res.status(200).json(items);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 6) Promote to admin
exports.promoteUser = async (req, res) => {
  const { email } = req.params;

  try {
    const { Item: user } = await dynamoDB
      .get({ TableName: USERS_TBL, Key: { userId: email } })
      .promise();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await dynamoDB.put({
      TableName: ADMINS_TBL,
      Item: {
        userId:      email,
        name:        user.name,
        password:    user.password,
        phone:       user.phone,
        promotedAt:  new Date().toISOString()
      }
    }).promise();

    await dynamoDB.delete({
      TableName: USERS_TBL,
      Key: { userId: email }
    }).promise();

    res.json({ message: "User promoted to admin" });
  } catch (err) {
    console.error("promoteUser error:", err);
    res.status(500).json({ message: "Promotion failed", error: err.message });
  }
};

// 7) Departments: list
exports.getAllDepartments = async (req, res) => {
  try {
    const data = await dynamoDB.scan({ TableName: DEPTS_TBL }).promise();
    res.json(data.Items);
  } catch (err) {
    console.error("getAllDepartments error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 8) Departments: update a user’s list
exports.updateUserDepartments = async (req, res) => {
  const { email } = req.params;
  const { departmentIds } = req.body;

  if (!Array.isArray(departmentIds)) {
    return res.status(400).json({ message: "departmentIds must be an array" });
  }

  try {
    await dynamoDB.update({
      TableName: USERS_TBL,
      Key: { userId: email },
      UpdateExpression: "SET departmentIds = :d",
      ExpressionAttributeValues: { ":d": departmentIds }
    }).promise();

    res.json({ message: "Departments updated" });
  } catch (err) {
    console.error("updateUserDepartments error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};