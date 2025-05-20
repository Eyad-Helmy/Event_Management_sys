const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const VenueController = require('../controllers/venueController');
const { body } = require('express-validator');

router.get(
  '/',
  VenueController.getAllVenues
)

router.post(
  '/add-venue',
  authenticateUser,
  authorizeRole('venue_admin'),
  [
    body('name').notEmpty(),
    body('location').notEmpty(),
    body('capacity').notEmpty()
  ],
  VenueController.addVenue
);

router.get(
  '/my',
  authenticateUser,
  authorizeRole('venue_admin'),
  VenueController.getMyVenues
);

module.exports = router;
