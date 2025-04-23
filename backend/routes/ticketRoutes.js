const express = require('express');
const {
  createTicket,
  getTicketsByUser,
  updateTicket,
  getAllTickets,
  deleteTicket
} = require('../controllers/ticketController');

const router = express.Router();

// Public admin route to fetch all tickets
router.get('/all', getAllTickets);

// Per-user route (must come after `/all`)
router.get('/:userEmail', getTicketsByUser);

// Create, update, delete
router.post('/', createTicket);
router.put('/:ticketId', updateTicket);
router.delete('/:ticketId', deleteTicket);

module.exports = router;