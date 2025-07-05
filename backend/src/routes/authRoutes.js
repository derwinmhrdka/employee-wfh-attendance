const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { validateLogin } = require('../middlewares/validators/authValidator');

// Test ping
router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Login Employee
router.post('/employee/login', validateLogin, authController.loginEmployee);

// Login Admin
router.post('/admin/login', validateLogin, authController.loginAdmin);

// Logout current session
router.post('/logout', verifyToken, authController.logout);

// Admin: List active sessions for employeeId (self or others)
router.get('/sessions', verifyToken, authController.listSessions);

// Admin: Revoke specific session by employeeId & sessionId
router.post('/sessions/revoke/:employeeId', verifyToken, authController.revokeSession);

module.exports = router;
