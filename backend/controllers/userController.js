const dynamoDB = require("../config/dynamo");
const { publishNotification } = require("../utils/sns"); 
const { v4: uuidv4 } = require("uuid");

const USERS_TBL = "TicketSystem-Users";
const ADMINS_TBL = "TicketSystem-Admins";
const DEPTS_TBL = "TicketSystem-Departments";

// 1) Register new user
exports.registerUser = async (req, res) => {
  const { name, email, password, phone, departmentIds = [] } = req.body;
  const getParams = { TableName: USERS_TBL, Key: { userId: email } };

  try {
    const existing = await dynamoDB.get(getParams).promise();
    if (existing.Item) {
      return res.status(400).json({ message: "User already exists" });
    }

    await publishNotification({
      subject: `Welcome to TTMS, ${name}!`,
      message: `Hi ${name},\nYour account (${email}) has been created successfully.`
    });

    await dynamoDB.put({
      TableName: USERS_TBL,
      Item: {
        userId: email,
        name,
        password,
        phone,
        departmentIds,
        createdAt: new Date().toISOString(),
      },
    }).promise();


    res.status(201).json({ message: "User registered successfully", userId: email });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 2) Login user or admin
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and Password are required" });

  try {
    const adminRes = await dynamoDB.get({ TableName: ADMINS_TBL, Key: { email } }).promise();
    if (adminRes.Item && adminRes.Item.password === password) {
      await publishNotification({
        subject: "Admin Login Notification",
        message: `Admin ${email} signed in at ${new Date().toISOString()}`
      });
      return res.status(200).json({ message: "Login successful", userId: email, role: "admin", name: adminRes.Item.name });
    }

    const userRes = await dynamoDB.get({ TableName: USERS_TBL, Key: { userId: email } }).promise();
    if (userRes.Item && userRes.Item.password === password) {
            return res.status(200).json({ message: "Login successful", userId: email, role: "user", name: userRes.Item.name });
    }

    return res.status(400).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("loginUser error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 3) Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const { Item: user } = await dynamoDB.get({ TableName: USERS_TBL, Key: { userId: email } }).promise();
    if (!user) return res.status(404).json({ message: "No user with that email" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await dynamoDB.update({
      TableName: USERS_TBL,
      Key: { userId: email },
      UpdateExpression: "SET resetCode = :c, resetExpires = :e",
      ExpressionAttributeValues: { ":c": code, ":e": expires }
    }).promise();

    publishNotification({
      subject: "TTMS Password Reset Code",
      message: `Password reset code for ${email} is ${code}. Expires in 15 minutes.`
    });

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
    const { Item: user } = await dynamoDB.get({ TableName: USERS_TBL, Key: { userId: email } }).promise();
    if (!user) return res.status(404).json({ message: "No such user" });

    if (user.resetCode !== code || new Date() > new Date(user.resetExpires)) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    await dynamoDB.update({
      TableName: USERS_TBL,
      Key: { userId: email },
      UpdateExpression: "SET password = :p REMOVE resetCode, resetExpires",
      ExpressionAttributeValues: { ":p": newPassword }
    }).promise();

    publishNotification({
      subject: "TTMS Password Reset Successful",
      message: `Password for ${email} was reset at ${new Date().toISOString()}`
    });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 5) Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const data = await dynamoDB.scan({ TableName: USERS_TBL }).promise();
    const items = data.Items.map(item => ({
      email: item.userId,
      name: item.name,
      phone: item.phone,
      createdAt: item.createdAt,
      departmentIds: item.departmentIds || [],
    }));
    res.status(200).json(items);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 6) Promote user to admin
exports.promoteUser = async (req, res) => {
  const { email } = req.params;
  try {
    const { Item: user } = await dynamoDB.get({ TableName: USERS_TBL, Key: { userId: email } }).promise();
    if (!user) return res.status(404).json({ message: "User not found" });

    await dynamoDB.put({
      TableName: ADMINS_TBL,
      Item: {
        email: email,
        name: user.name,
        password: user.password,
        phone: user.phone,
        promotedAt: new Date().toISOString()
      }
    }).promise();

    await dynamoDB.delete({ TableName: USERS_TBL, Key: { userId: email } }).promise();

    await publishNotification({
      subject: "User Promoted to Admin",
      message: `${email} was promoted to admin on ${new Date().toISOString()}`
    });

    res.json({ message: "User promoted to admin" });
  } catch (err) {
    console.error("promoteUser error:", err);
    res.status(500).json({ message: "Promotion failed", error: err.message });
  }
};

// 7) Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const data = await dynamoDB.scan({ TableName: DEPTS_TBL }).promise();
    res.json(data.Items);
  } catch (err) {
    console.error("getAllDepartments error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 8) Update user departments
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

// 9) Delete user
exports.deleteUser = async (req, res) => {
  const { email } = req.params;
  try {
    await dynamoDB.delete({ TableName: USERS_TBL, Key: { userId: email } }).promise();

    await publishNotification({
      subject: "User Account Deleted",
      message: `The user account ${email} was deleted at ${new Date().toISOString()}`
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};
