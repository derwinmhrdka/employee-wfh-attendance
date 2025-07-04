exports.success = (res, message = 'Success', data = {}, status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

exports.error = (res, message = 'Internal Server Error', status = 500, errors = null) => {
  return res.status(status).json({
    success: false,
    message,
    errors: errors || null,
  });
};
