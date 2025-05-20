const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// Organizer: Request a booking
router.post(
  '/request',
  authenticateUser,
  authorizeRole('organizer'),
  bookingController.requestBooking
);

// Organizer: View own bookings
router.get(
  '/my',
  authenticateUser,
  authorizeRole('organizer'),
  bookingController.getMyBookings
);

// Venue admin: View requests for their venues
router.get(
  '/venue-requests',
  authenticateUser,
  authorizeRole('venue_admin'),
  bookingController.getVenueRequests
);

// Venue admin: Approve a request
router.patch(
  '/:id/approve',
  authenticateUser,
  authorizeRole('venue_admin'),
  bookingController.approveBooking
);

// Venue admin: Reject a request
router.patch(
  '/:id/reject',
  authenticateUser,
  authorizeRole('venue_admin'),
  bookingController.rejectBooking
);

module.exports = router;
