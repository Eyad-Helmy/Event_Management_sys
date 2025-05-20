const { pool } = require('../config/database');

const Booking = {
  async request({ event_id, venue_id, organizer_id, admin_id }) {
    const [result] = await pool.query(
      `INSERT INTO bookings (event_id, venue_id, organizer_id, admin_id)
       VALUES (?, ?, ?, ?)`,
      [event_id, venue_id, organizer_id, admin_id]
    );
    return result.insertId;
  },

  async getByOrganizer(organizer_id) {
    const [rows] = await pool.query(
      `SELECT b.*, e.title AS event_title, v.name AS venue_name 
       FROM bookings b
       JOIN events e ON b.event_id = e.id
       JOIN venues v ON b.venue_id = v.id
       WHERE b.organizer_id = ?`,
      [organizer_id]
    );
    return rows;
  },

  async getByAdmin(admin_id) {
    const [rows] = await pool.query(
      `SELECT b.*, e.title AS event_title, v.name AS venue_name, u.username AS organizer_name
       FROM bookings b
       JOIN events e ON b.event_id = e.id
       JOIN venues v ON b.venue_id = v.id
       JOIN users u ON b.organizer_id = u.id
       WHERE b.admin_id = ? AND b.status = 'pending'`, // Only pending bookings
      [admin_id]
    );
    return rows;
  },

  async updateStatus(id, status) {
    const [result] = await pool.query(
      `UPDATE bookings 
       SET status = ?, decision_date = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [status, id]
    );
    return result.affectedRows > 0;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    return rows[0];
  },
};

module.exports = Booking;
