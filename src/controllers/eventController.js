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

module.exports = { createEvent, getMyEvents };
