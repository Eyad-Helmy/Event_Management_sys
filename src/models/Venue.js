const { pool } = require('../config/database');

const Venue = {
  async create({ name, location, capacity, adminId }) {
    const [result] = await pool.query(
      'INSERT INTO venues (name, location, capacity, admin_id) VALUES (?, ?, ?, ?)',
      [name, location, capacity, adminId]
    );
    return result.insertId;
  },

  async getByAdmin(adminId) {
    const [rows] = await pool.query('SELECT * FROM venues WHERE admin_id = ?', [adminId]);
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM venues WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = Venue;
