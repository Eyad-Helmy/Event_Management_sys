const {pool} = require('../config/database');

const Event = {
  async create({ title, description, date, organizerId, venueId }) {
    const [result] = await pool.query(
      'INSERT INTO events (title, description, date, organizer_id, venue_id) VALUES (?, ?, ?, ?, ?)',
      [title, description, date, organizerId, venueId]
    );
    return result.insertId;
  },

  async getConflicting(venueId, date) {
    const [rows] = await pool.query(
      'SELECT * FROM events WHERE venue_id = ? AND date = ?',
      [venueId, date]
    );
    return rows.length > 0;
  },

  async getByOrganizer(organizerId) {
    const [rows] = await pool.query('SELECT * FROM events WHERE organizer_id = ?', [organizerId]);
    return rows;
  }
};

module.exports = Event;
