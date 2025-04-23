// At the bottom, next to getTicketsByUser…
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