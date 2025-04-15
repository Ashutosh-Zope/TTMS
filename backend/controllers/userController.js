// backend/controllers/userController.js
const dynamoDB = require('../config/dynamo');

const TABLE_NAME = 'TicketSystem-Users';

// Register new user
exports.registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  const getParams = {
    TableName: TABLE_NAME,
    Key: { email }
  };

  const putParams = {
    TableName: TABLE_NAME,
    Item: { email, name, password, phone, createdAt: new Date().toISOString() }
  };

  try {
    const existingUser = await dynamoDB.get(getParams).promise();

    if (existingUser.Item) {
      return res.status(400).json({ message: 'User already exists' });
    }

    await dynamoDB.put(putParams).promise();
    res.status(201).json({ message: 'User registered successfully', userId: email });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const getParams = {
    TableName: TABLE_NAME,
    Key: { email }
  };

  try {
    const result = await dynamoDB.get(getParams).promise();
    const user = result.Item;

    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', userId: user.email });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const getParams = {
    TableName: TABLE_NAME,
    Key: { email }
  };

  try {
    const result = await dynamoDB.get(getParams).promise();

    if (!result.Item) {
      return res.status(400).json({ message: 'No user found with that email' });
    }

    res.status(200).json({ message: 'Password reset instructions sent (placeholder)' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
