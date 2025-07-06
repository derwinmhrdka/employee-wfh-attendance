const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); 
const { 
  validateEditProfile, 
  validateClockInOut, 
  validateAttendanceSummary 
} = require('../middlewares/validators/employeeValidator');

// Routes
router.get('/profile', verifyToken, employeeController.getProfile);
router.patch('/profile', verifyToken, validateEditProfile, upload.single('photo'), employeeController.editProfile);
router.post('/attendance', verifyToken, validateClockInOut, employeeController.clockInOut);
router.get('/attendance', verifyToken, employeeController.getAttendance);
router.get('/attendance-summary', verifyToken, validateAttendanceSummary, employeeController.attendanceSummary);

module.exports = router;
