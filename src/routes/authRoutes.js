const express = require('express');
const router = express.Router();
const { register, login, switchRole } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');
const { body } = require('express-validator');

router.post('/register', [
  body('username').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], login);

router.post('/switch-role', authenticateUser, [
  body('role').isIn(['attendee', 'organizer', 'venue_admin', 'admin'])
], switchRole);

module.exports = router;
