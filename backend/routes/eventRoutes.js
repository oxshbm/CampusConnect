const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getApprovedEvents,
  createEvent,
  getEventById,
  rsvpEvent,
  cancelRsvp,
} = require('../controllers/eventController');

const router = express.Router();

// Public routes
router.get('/', getApprovedEvents);
router.get('/:id', getEventById);

// Protected routes
router.post('/', authMiddleware, createEvent);
router.post('/:id/rsvp', authMiddleware, rsvpEvent);
router.delete('/:id/rsvp', authMiddleware, cancelRsvp);

module.exports = router;
