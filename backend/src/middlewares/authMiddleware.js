const jwt = require('jsonwebtoken');
const redis = require('../config/redis');
const logger = require('../utils/logger');
const prisma = require('../config/prismaClient');

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { employee_id: decoded.employeeId },
      select: {
        employee_id: true,
        name: true,
        is_admin: true,
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token user.' });
    }

    const { sessionId } = decoded;
    const sessionKey = `session:${user.employee_id}:${sessionId}`;
    const session = await redis.get(sessionKey);

    if (!session) {
      logger.warn(`[Middleware] Session not found or expired for employeeId=${user.employee_id}`);
      return res.status(401).json({ message: 'Unauthorized: Invalid session' });
    }

    req.user = {
      employeeId: user.employee_id, 
      name: user.name,
      isAdmin: user.is_admin,
      sessionId: decoded.sessionId  
    };
    next();
  } catch (err) {
    logger.warn(`[Middleware] Invalid or expired JWT: ${err.message}`);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

exports.checkAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Admins only.',
    });
  }
  next();
};
