const express = require("express");
const multer = require("multer");
const {
  createTicket,
  getTicketsByUser,
  updateTicket,
  getAllTickets,
  deleteTicket,
} = require("../controllers/ticketController");

const router = express.Router();
const upload = multer(); // in-memory

// Static routes first
router.post(
  "/",
  upload.array("attachments", 5),  // up to 5 files under “attachments”
  createTicket
);

router.get("/all", getAllTickets);        // ✅ Make sure this comes before /:userEmail
router.get("/:userEmail", getTicketsByUser);

router.put("/:ticketId", updateTicket);
router.delete("/:ticketId", deleteTicket);

module.exports = router;
