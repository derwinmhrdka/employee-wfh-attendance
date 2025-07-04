const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Ping
router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Endpoint: Login Employee
router.post('/employee/login', authController.loginEmployee);

// Endpoint: Login Admin
router.post('/admin/login', authController.loginAdmin);

router.post('/logout', verifyToken, authController.logout);

module.exports = router;
