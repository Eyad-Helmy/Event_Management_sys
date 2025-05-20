const { validationResult } = require('express-validator');
const Event = require('../models/Event');
const Venue = require('../models/Venue');
const Booking = require('../models/Booking');
const { pool } = require('../config/database');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, venueId } = req.body;
    const organizerId = req.user.id;

    // Validate fields
    if (!title || !description || !date || !venueId) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    // Insert event with status 'pending'
    const [eventResult] = await pool.query(
      `INSERT INTO events (title, description, date, venue_id, organizer_id, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [title, description, date, venueId, organizerId]
    );

    const eventId = eventResult.insertId;

    // Get the venue's admin
    const [venueRows] = await pool.query(
      `SELECT admin_id FROM venues WHERE id = ?`,
      [venueId]
    );

    if (venueRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Venue not found' });
    }

    const adminId = venueRows[0].admin_id;

    // Create booking request
    await Booking.request({
      event_id: eventId,
      venue_id: venueId,
      organizer_id: organizerId,
      admin_id: adminId
    });

    return res.status(201).json({
      success: true,
      message: 'Event created and sent for approval',
      eventId
    });

  } catch (error) {
    console.error('Create event error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};  

const getMyEvents = async (req, res) => {
  const events = await Event.getByOrganizer(req.user.id);
  res.json({ success: true, events });
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.getAll();
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch events', error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.getById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch event', error: error.message });
  }
};

const cancelEvent = async (req, res) => {
  const { eventId } = req.params;
  const organizerId = req.user.id;

  try {
    const cancelled = await Event.cancel(eventId, organizerId);
    if (!cancelled) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found or you do not have permission to cancel it' 
      });
    }
    res.json({ success: true, message: 'Event cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel event', error: error.message });
  }
};

module.exports = { createEvent, getMyEvents, getAllEvents, getEventById, cancelEvent };
