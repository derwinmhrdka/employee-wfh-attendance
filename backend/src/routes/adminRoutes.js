const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { checkAdmin, verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); 
const {
  validateGetEmployees,
  validateCreateEmployee,
  validateEditEmployee,
  validateGetAttendances,
  validateGetLogs
} = require('../middlewares/validators/adminValidator');


router.get('/employee', verifyToken, checkAdmin, validateGetEmployees, adminController.getEmployees);
router.post('/employee', verifyToken, checkAdmin, upload.single('photo'), validateCreateEmployee, adminController.createEmployee);
router.patch('/employee/:employeeId', verifyToken, checkAdmin, upload.single('photo'), validateEditEmployee, adminController.editEmployee);

router.get('/attendance', verifyToken, checkAdmin, validateGetAttendances, adminController.getAttendances);

router.get('/logs/:employeeId', verifyToken, checkAdmin, validateGetLogs, adminController.getLogs);

module.exports = router;
