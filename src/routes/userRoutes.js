const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const userController = require('../controllers/userController');
const { body } = require('express-validator');

router.get('/me', authenticateUser, userController.getUserProfile);
router.delete('/me', authenticateUser, userController.deleteAccount);

router.post('/switch-role', 
  authenticateUser,
  [
    body('role').isIn(['attendee', 'organizer', 'venue_admin'])
  ],
  userController.switchRole
);

router.post('/add-role',
  authenticateUser,
  [
    body('role').isIn(['attendee', 'organizer', 'venue_admin', 'admin'])
  ],
  userController.addRole
);

module.exports = router;
