const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/me', authenticateUser, userController.getUserProfile);
router.delete('/me', authenticateUser, userController.deleteAccount);

module.exports = router;
