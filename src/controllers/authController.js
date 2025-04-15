const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { generateToken } = require('../config/jwt');
const User = require('../models/User');
const UserRole = require('../models/UserRole');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  const { username, email, password, role = 'attendee' } = req.body;

  if (await User.getByEmail(email))
    return res.status(400).json({ success: false, message: 'Email already registered' });

  if (await User.getByUsername(username))
    return res.status(400).json({ success: false, message: 'Username already taken' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await User.create({ username, email, hashedPassword, activeRole: role });
  try {
    await UserRole.create(role, userId);
  } catch (error) {
    return res.status(500).json({succes: false, err: error.message});
  }

  const token = generateToken(userId, role);
  res.status(201).json({ success: true, user: { id: userId, username, email, role }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.getByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const token = generateToken(user.id, user.active_role);
  res.json({ success: true, user: { id: user.id, username: user.username, email: user.email, role: user.active_role }, token });
};

const switchRole = async (req, res) => {
  const { role } = req.body;
  const userId = req.user.id;

  const hasRole = await UserRole.hasRole(userId, role);
  if (!hasRole)
    return res.status(403).json({ success: false, message: 'User does not have this role' });

  await User.updateActiveRole(userId, role);
  const token = generateToken(userId, role);
  res.json({ success: true, message: 'Role switched', token });
};

module.exports = { register, login, switchRole };
