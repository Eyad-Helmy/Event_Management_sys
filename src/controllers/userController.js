const User = require('../models/User');

const getUserProfile = async (req, res) => {
  const user = await User.getById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  res.json({ success: true, user: { id: user.id, username: user.username, email: user.email, active_role: user.active_role } });
};

const deleteAccount = async (req, res) => {
  await User.delete(req.user.id);
  res.json({ success: true, message: 'Account deleted successfully' });
};

// const listUsers = async (req, res) => {
//   const users = await User.getAll();
//   res.json({ success: true, users });
// };

module.exports = { getUserProfile, deleteAccount };
