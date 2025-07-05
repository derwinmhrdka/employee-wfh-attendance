const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); 

router.get('/employee', verifyToken, adminController.getEmployees);
router.post('/employee', verifyToken, upload.single('photo'), adminController.createEmployee);
router.patch('/employee/:employeeId', verifyToken, upload.single('photo'), adminController.editEmployee);

router.get('/attendance', verifyToken, adminController.getAttendances);

router.get('/logs/:employeeId', verifyToken, adminController.getLogs);

module.exports = router;
