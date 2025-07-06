const { error } = require('../utils/responseHelper');
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.stack || err);

  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  if (err.isJoi) {
    status = 400;
    message = err.details?.[0]?.message || 'Validation Error';
  }

  if (err.code && err.code.startsWith('P')) {
    status = 500;
    message = 'Database error';
  }

  return error(res, message, status, err.errors || null);
};