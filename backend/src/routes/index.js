const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

router.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

router.use('/auth', require('./authRoutes'));
router.use('/employee', require('./employeeRoutes'));
router.use('/admin', require('./adminRoutes'));

module.exports = router;

