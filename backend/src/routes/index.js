const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

router.use('/auth', require('./authRoutes'));
router.use('/employee', require('./employeeRoutes'));
router.use('/admin', require('./adminRoutes'));

module.exports = router;

