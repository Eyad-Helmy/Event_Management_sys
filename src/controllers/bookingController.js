const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { validationResult } = require('express-validator');

const requestBooking = async (req, res) => {
  try {
    const { event_id, venue_id, admin_id } = req.body;
    const organizer_id = req.user.id;

    if (!event_id || !venue_id || !admin_id) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const bookingId = await Booking.request({
      event_id,
      venue_id,
      organizer_id,
      admin_id
    });

    return res.status(201).json({
      success: true,
      message: 'Booking request submitted.',
      bookingId
    });
  } catch (error) {
    console.error('Booking request error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.getByOrganizer(req.user.id);
    return res.json({ success: true, bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const getVenueRequests = async (req, res) => {
  try {
    const bookings = await Booking.getByAdmin(req.user.id);
    return res.json({ success: true, bookings });
  } catch (error) {
    console.error('Get admin bookings error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const approveBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    console.log('Approving booking:', bookingId);

    const bookingUpdated = await Booking.updateStatus(bookingId, 'approved');
    console.log('Booking updated:', bookingUpdated);

    if (!bookingUpdated) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const booking = await Booking.getById(bookingId);
    console.log('Fetched booking:', booking);

    if (booking && booking.event_id) {
      const eventUpdated = await Event.updateStatus(booking.event_id, 'approved');
      console.log('Event updated:', eventUpdated);
    }

    res.json({ success: true, message: 'Booking approved.' });
  } catch (err) {
    console.error('Approve booking error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const rejectBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const success = await Booking.updateStatus(bookingId, 'rejected');
    return res.json({
      success,
      message: success ? 'Booking rejected.' : 'Booking not found.'
    });
  } catch (error) {
    console.error('Reject booking error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  requestBooking,
  getMyBookings,
  getVenueRequests,
  approveBooking,
  rejectBooking
};
