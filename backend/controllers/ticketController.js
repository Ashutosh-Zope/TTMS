const { v4: uuidv4 } = require('uuid');
const dynamoDB = require('../config/dynamo');

const TABLE_NAME = 'TicketSystem-Tickets';

// Create Ticket
exports.createTicket = async (req, res) => {
  const {
    title,
    description,
    userEmail,
    status = "open",
    priority = "medium",
    tags = []
  } = req.body;

  const ticketId = uuidv4();

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
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    res.status(201).json({ message: 'Ticket created', ticketId });
  } catch (err) {
    res.status(500).json({ message: 'Could not create ticket', error: err });
  }
};


// View All Tickets for a User
exports.getTicketsByUser = async (req, res) => {
  const { userEmail } = req.params;

  const params = {
    TableName: TABLE_NAME,
    FilterExpression: 'userEmail = :email',
    ExpressionAttributeValues: {
      ':email': userEmail,
    },
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.status(200).json(data.Items);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch tickets', error: err });
  }
};

// Update Ticket
exports.updateTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { title, description, status, priority, tags } = req.body;

  let updateExpr = "set";
  let exprAttrVals = {};

  if (title) {
    updateExpr += " title = :title,";
    exprAttrVals[":title"] = title;
  }
  if (description) {
    updateExpr += " description = :desc,";
    exprAttrVals[":desc"] = description;
  }
  if (status) {
    updateExpr += " status = :status,";
    exprAttrVals[":status"] = status;
  }
  if (priority) {
    updateExpr += " priority = :priority,";
    exprAttrVals[":priority"] = priority;
  }
  if (tags) {
    updateExpr += " tags = :tags,";
    exprAttrVals[":tags"] = tags;
  }

  // Remove last comma
  updateExpr = updateExpr.replace(/,$/, "");

  const params = {
    TableName: TABLE_NAME,
    Key: { ticketId },
    UpdateExpression: updateExpr,
    ExpressionAttributeValues: exprAttrVals,
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const data = await dynamoDB.update(params).promise();
    res.status(200).json({ message: "Ticket updated", updatedFields: data.Attributes });
  } catch (err) {
    res.status(500).json({ message: "Could not update ticket", error: err });
  }
};

// Delete Ticket
exports.deleteTicket = async (req, res) => {
  const { ticketId } = req.params;

  const params = {
    TableName: TABLE_NAME,
    Key: { ticketId },
  };

  try {
    await dynamoDB.delete(params).promise();
    res.status(200).json({ message: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete ticket', error: err });
  }
};
