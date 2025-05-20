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
  },

  async getAll() {
    const [rows] = await pool.query(`
      SELECT 
        e.*,
        v.name as venue_name,
        v.location as venue_location,
        u.username as organizer_name
      FROM events e
      LEFT JOIN venues v ON e.venue_id = v.id
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE e.status = 'approved'
      ORDER BY e.date ASC
    `);
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(`
      SELECT 
        e.*,
        v.name as venue_name,
        v.location as venue_location,
        u.username as organizer_name
      FROM events e
      LEFT JOIN venues v ON e.venue_id = v.id
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE e.id = ?
    `, [id]);
    return rows[0];
  },

  async cancel(eventId, organizerId) {
    const [result] = await pool.query(
      'DELETE FROM events WHERE id = ? AND organizer_id = ?',
      [eventId, organizerId]
    );
    return result.affectedRows > 0;
  },

  async updateStatus(id, status) {
    const [result] = await pool.query(
      'UPDATE events SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = Event;
