const express = require("express");
const multer = require("multer");
const AWS = require('aws-sdk');
const {
  createTicket,
  getTicketsByUser,
  updateTicket,
  getAllTickets,
  deleteTicket,
} = require("../controllers/ticketController");

const router = express.Router();
const upload = multer(); // in-memory upload

// AWS S3 Setup for pre-signed download
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const s3 = new AWS.S3();

// --- 🔥 Secure Download API --- //
router.get("/download/:key", async (req, res) => {
  const { key } = req.params;
  const params = {
    Bucket: 'ttma-bucket',
    Key: `ttms-agency/uploads/${key}`,
    Expires: 3600, // 1 hour expiry
  };
  try {
    const url = s3.getSignedUrl('getObject', params);
    res.json({ url });
  } catch (err) {
    console.error('❌ Error generating pre-signed URL:', err.message);
    res.status(500).json({ error: 'Failed to generate download link' });
  }
});

// --- Your existing static routes --- //
router.post(
  "/",
  upload.array("attachments", 5), // accept up to 5 attachments
  createTicket
);

router.get("/all", getAllTickets); // ✅ Important: static /all route first
router.get("/:userEmail", getTicketsByUser);

router.put("/:ticketId", updateTicket);
router.delete("/:ticketId", deleteTicket);

module.exports = router;
