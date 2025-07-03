const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Routes
router.get('/profile', verifyToken, employeeController.getProfile);
router.patch('/profile', verifyToken, employeeController.editProfile);
router.post('/attendance', verifyToken, employeeController.clockInOut);
router.get('/attendance', verifyToken, employeeController.getAttendance);
router.get('/attendance-summary', verifyToken, employeeController.attendanceSummary);

module.exports = router;
