const { validationResult } = require('express-validator');
const Event = require('../models/Event');
const Venue = require('../models/Venue');

const createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, description, date, venueId } = req.body;
  const organizerId = req.user.id;

  const venue = await Venue.getById(venueId);
  if (!venue) return res.status(404).json({ success: false, message: 'Venue not found' });

  const conflict = await Event.getConflicting(venueId, date);
  if (conflict) return res.status(400).json({ success: false, message: 'Venue already booked' });

  const eventId = await Event.create({ title, description, date, organizerId, venueId });
  res.status(201).json({ success: true, eventId, message: 'Event created and pending approval' });
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
