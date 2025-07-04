const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next({
      status: 401,
      message: 'No token provided or malformed'
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next({
      status: 401,
      message: 'Invalid token format'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Verify Error:', err.message);
    return next({
      status: 401,
      message: 'Invalid or expired token'
    });
  }
};
