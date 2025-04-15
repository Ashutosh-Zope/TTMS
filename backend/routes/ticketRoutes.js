const express = require('express');
const {
  createTicket,
  getTicketsByUser,
  updateTicket,
  deleteTicket
} = require('../controllers/ticketController');

const router = express.Router();

router.post('/', createTicket);
router.get('/:userEmail', getTicketsByUser);
router.put('/:ticketId', updateTicket);
router.delete('/:ticketId', deleteTicket);

module.exports = router;
