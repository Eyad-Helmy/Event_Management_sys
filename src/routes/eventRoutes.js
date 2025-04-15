const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const { createEvent, getMyEvents } = require('../controllers/eventController');
const { body } = require('express-validator');

router.post(
  '/create-event',
  authenticateUser,
  authorizeRole('organizer'),
  [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('date').notEmpty(),
    body('venueId').isInt()
  ],
  createEvent
);

router.get(
  '/my',
  authenticateUser,
  authorizeRole('organizer'),
  getMyEvents
);

module.exports = router;
