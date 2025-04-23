// backend/routes/ticketRoutes.js
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

router.post(
  "/",
  upload.array("attachments", 5),  // up to 5 files under “attachments”
  createTicket
);
router.get("/:userEmail", getTicketsByUser);
router.get("/all", getAllTickets);
router.put("/:ticketId", updateTicket);
router.delete("/:ticketId", deleteTicket);

module.exports = router;