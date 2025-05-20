const { validationResult } = require('express-validator');
const Venue = require('../models/Venue');

const VenueController = {
  async addVenue(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, location, capacity } = req.body;
    const adminId = req.user.id;

    const venueId = await Venue.create({ name, location, capacity, adminId });
    res.status(201).json({ success: true, venueId, message: 'Venue created successfully' });
  },

  async getMyVenues(req, res) {
    const venues = await Venue.getByAdmin(req.user.id);
    res.json({ success: true, venues });
  },

  async getAllVenues(req, res) {
    try {
      const venues = await Venue.getAll();
      res.json(venues);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch venues' });
    }
  },
};

module.exports = VenueController;
