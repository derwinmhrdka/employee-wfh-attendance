const prisma = require('../config/prismaClient');
const redis = require('../config/redis');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { success, error } = require('../utils/responseHelper');
const User = require('../models/userModel');
const logger = require('../utils/logger');
const { nanoid } = require('nanoid');

exports.loginEmployee = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await prisma.user.findUnique({
      where: { email },
    });

    if (!result) {
      logger.warn(`[Auth] Employee login failed: User not found for ${email}`);
      return error(res, 'User not found', 401);
    }

    const user = new User(result);

    if (user.status != "active") {
      logger.warn(`[Auth] Employee login failed: User is not active ${email}`);
      return error(res, 'User not active', 401);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      logger.warn(`[Auth] Employee login failed: Invalid password for ${email}`);
      return error(res, 'Invalid password', 401);
    }

    const sessionId = nanoid();
    const token = jwt.sign(
      {
        employeeId: user.employeeId,
        isAdmin: user.isAdmin,
        sessionId
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const sessionKey = `session:${user.employeeId}:${sessionId}`;
    await redis.set(sessionKey, JSON.stringify({ token }), 'EX', 3600);

    logger.info(`[Auth] Employee login success: ${email}`);

    return success(res, 'Login successful', {
      token,
      user: {
        name: user.name,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    logger.error('[Auth] loginEmployee failed', err);
    next(err);
  }
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await prisma.user.findFirst({
      where: {
        email: email,
        is_admin: true
      }
    });

    if (!result) {
      logger.warn(`[Auth] Admin login failed: User not found or not admin for ${email}`);
      return error(res, 'User not found or not admin', 401);
    }

    const user = new User(result);

    if (user.status != "active") {
      logger.warn(`[Auth] Admin login failed: User is not active ${email}`);
      return error(res, 'User not active', 401);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      logger.warn(`[Auth] Admin login failed: Invalid password for ${email}`);
      return error(res, 'Invalid password', 401);
    }

    const sessionId = nanoid();
    const token = jwt.sign(
      {
        employeeId: user.employeeId,
        isAdmin: user.isAdmin,
        sessionId
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const sessionKey = `session:${user.employeeId}:${sessionId}`;
    await redis.set(sessionKey, JSON.stringify({ token }), 'EX', 3600);

    logger.info(`[Auth] Admin login success: ${email}`);

    return success(res, 'Login successful', {
      token,
      user: {
        name: user.name,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    logger.error('[Auth] loginAdmin failed', err);
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { employeeId, sessionId } = req.user;

    const sessionKey = `session:${employeeId}:${sessionId}`;
    await redis.del(sessionKey);

    logger.info(`[Auth] Logout success: employeeId=${employeeId} sessionId=${sessionId}`);

    return success(res, 'Logout successful');
  } catch (err) {
    logger.error('[Auth] logout failed', err);
    next(err);
  }
};

exports.listSessions = async (req, res, next) => {
  try {
    const { employeeId } = req.user;

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Only admin' });
    }

    const keys = await redis.keys(`session:${employeeId}:*`);

    const sessions = [];
    for (const key of keys) {
      const data = await redis.get(key);
      sessions.push({
        key,
        data: JSON.parse(data)
      });
    }

    return success(res, 'Active sessions fetched', sessions);
  } catch (err) {
    logger.error('[Auth] listSessions failed', err);
    next(err);
  }
};

exports.revokeSession = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { sessionId } = req.body;

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Only admin' });
    }

    await redis.del(`session:${employeeId}:${sessionId}`);

    return success(res, 'Session revoked');
  } catch (err) {
    logger.error('[Auth] revokeSession failed', err);
    next(err);
  }
};

