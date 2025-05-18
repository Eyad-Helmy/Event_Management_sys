const User = require('../models/User');
const UserRole = require('../models/UserRole');
const { generateToken } = require('../config/jwt');

const getUserProfile = async (req, res) => {
  const user = await User.getById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  res.json({ success: true, user: { id: user.id, username: user.username, email: user.email, active_role: user.active_role } });
};

const deleteAccount = async (req, res) => {
  await User.delete(req.user.id);
  res.json({ success: true, message: 'Account deleted successfully' });
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

const addRole = async (req, res) => {
  const { role } = req.body;
  const userId = req.user.id;

  const hasRole = await UserRole.hasRole(userId, role);
  if (hasRole)
    return res.status(400).json({ success: false, message: 'User already has this role' });

  try {
    await UserRole.create(role, userId);
    res.json({ success: true, message: 'Role added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add role', error: error.message });
  }
};

// const listUsers = async (req, res) => {
//   const users = await User.getAll();
//   res.json({ success: true, users });
// };

module.exports = { getUserProfile, deleteAccount, switchRole, addRole };
