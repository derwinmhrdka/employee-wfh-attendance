const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/employee', verifyToken, adminController.getEmployees);
router.post('/employee', verifyToken, adminController.createEmployee);
router.patch('/employee/:employeeId', verifyToken, adminController.editEmployee);

router.get('/attendance', verifyToken, adminController.getAttendances);

module.exports = router;
