const jwt = require('jsonwebtoken');
const redis = require('../config/redis');
const logger = require('../utils/logger');

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or malformed' });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    logger.warn(`[Middleware] Invalid or expired JWT: ${err.message}`);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  const { employeeId, sessionId } = decoded;

  const sessionKey = `session:${employeeId}:${sessionId}`;
  const session = await redis.get(sessionKey);

  if (!session) {
    logger.warn(`[Middleware] Session not found or expired for employeeId=${employeeId}`);
    return res.status(401).json({ message: 'Unauthorized: Invalid session' });
  }

  req.user = decoded;
  next();
};
