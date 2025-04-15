const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const { addVenue, getMyVenues } = require('../controllers/venueController');
const { body } = require('express-validator');

router.post(
  '/add-venue',
  authenticateUser,
  authorizeRole('venue_admin'),
  [
    body('name').notEmpty(),
    body('location').notEmpty(),
    body('capacity').notEmpty()
  ],
  addVenue
);

router.get(
  '/my',
  authenticateUser,
  authorizeRole('venue_admin'),
  getMyVenues
);

module.exports = router;
