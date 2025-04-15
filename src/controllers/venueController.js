const { validationResult } = require('express-validator');
const Venue = require('../models/Venue');

const addVenue = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, location, capacity } = req.body;
  const adminId = req.user.id;

  const venueId = await Venue.create({ name, location, capacity, adminId });
  res.status(201).json({ success: true, venueId, message: 'Venue created successfully' });
};

const getMyVenues = async (req, res) => {
  const venues = await Venue.getByAdmin(req.user.id);
  res.json({ success: true, venues });
};

module.exports = { addVenue, getMyVenues };
