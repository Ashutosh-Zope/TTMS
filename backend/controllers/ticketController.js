// backend/controllers/ticketController.js
const { v4: uuidv4 } = require("uuid");
const dynamoDB = require("../config/dynamo");

const TABLE_NAME = "TicketSystem-Tickets";

// Create Ticket (unchanged)
exports.createTicket = async (req, res) => {
  const {
    title,
    description,
    userEmail,
    status = "open",
    priority = "medium",
    tags = [],
  } = req.body;

  const ticketId = uuidv4();
  const now = new Date().toISOString();

  const params = {
    TableName: TABLE_NAME,
    Item: {
      ticketId,
      title,
      description,
      userEmail,
      status,
      priority,
      tags,
      createdAt: now,
      updatedAt: now,
    },
  };

  try {
    await dynamoDB.put(params).promise();
    res.status(201).json({ message: "Ticket created", ticketId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not create ticket", error: err.message });
  }
};

// View All Tickets for a User (unchanged)
exports.getTicketsByUser = async (req, res) => {
  const { userEmail } = req.params;
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "userEmail = :email",
    ExpressionAttributeValues: { ":email": userEmail },
  };
  try {
    const data = await dynamoDB.scan(params).promise();
    res.status(200).json(data.Items);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not fetch tickets", error: err.message });
  }
};

// Update Ticket — now preserves userEmail & createdAt
exports.updateTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { title, description, status, priority, tags = [] } = req.body;

  try {
    // 1) Fetch existing item
    const getParams = {
      TableName: TABLE_NAME,
      Key: { ticketId },
    };
    const result = await dynamoDB.get(getParams).promise();
    if (!result.Item) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const { userEmail, createdAt } = result.Item;
    const now = new Date().toISOString();

    // 2) Merge in updated fields
    const updatedItem = {
      ticketId,
      userEmail,
      createdAt,
      title,
      description,
      status,
      priority,
      tags,
      updatedAt: now,
    };

    // 3) Put the merged item back
    const putParams = {
      TableName: TABLE_NAME,
      Item: updatedItem,
    };
    await dynamoDB.put(putParams).promise();

    res.status(200).json({ message: "Ticket updated", ticketId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not update ticket", error: err.message });
  }
};

// Delete Ticket (unchanged)
exports.deleteTicket = async (req, res) => {
  const { ticketId } = req.params;
  const params = {
    TableName: TABLE_NAME,
    Key: { ticketId },
  };

  try {
    await dynamoDB.delete(params).promise();
    res.status(200).json({ message: "Ticket deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not delete ticket", error: err.message });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const data = await dynamoDB.scan({ TableName: TABLE_NAME }).promise();
    return res.status(200).json(data.Items);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Could not fetch all tickets", error: err.message });
  }
};