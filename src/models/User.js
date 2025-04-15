const { pool } = require('../config/database');

const User = {
  async create({ username, email, hashedPassword, activeRole }) {
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, active_role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, activeRole]
    );
    return result.insertId;
  },

  async getByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async getByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  async updateActiveRole(userId, role) {
    await pool.query('UPDATE users SET active_role = ? WHERE id = ?', [role, userId]);
  },

//   async getAll() {
//     const [rows] = await pool.query('SELECT id, username, email, active_role FROM users');
//     return rows;
//   },

  async delete(id) {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
  }
};

module.exports = User;
