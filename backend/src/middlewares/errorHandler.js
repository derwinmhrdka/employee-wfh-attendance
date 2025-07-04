const { error } = require('../utils/responseHelper');

module.exports = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  return error(res, message, status, err.errors || null);
};