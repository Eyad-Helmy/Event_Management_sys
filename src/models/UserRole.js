const { pool } = require('../config/database');

const UserRole = {
  async create(role, userId) {
    await pool.query('INSERT INTO user_roles (role, user_id) VALUES (?, ?)', [role, userId]);
  },

  async hasRole(userId, role) {
    const [rows] = await pool.query(
      'SELECT * FROM user_roles WHERE user_id = ? AND role = ?',
      [userId, role]
    );
    return rows.length > 0;
  }
};

module.exports = UserRole;
