const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const { createEvent, getMyEvents, getAllEvents, getEventById, cancelEvent } = require('../controllers/eventController');
const { body } = require('express-validator');

router.get('/', getAllEvents);

router.get(
  '/my',
  authenticateUser,
  authorizeRole('organizer'),
  getMyEvents
);

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

router.get('/:eventId', getEventById);

router.delete(
  '/:eventId',
  authenticateUser,
  authorizeRole('organizer'),
  cancelEvent
);

module.exports = router;
