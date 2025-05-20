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
  },

  async getAll() {
    const [rows] = await pool.query(`
      SELECT 
        v.*,
        u.username as admin_name
      FROM venues v
      LEFT JOIN users u ON v.admin_id = u.id
      ORDER BY v.name ASC
    `);
    return rows;
  },
};

module.exports = Venue;
