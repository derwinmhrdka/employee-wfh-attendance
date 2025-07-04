const pool = require('../config/db');
const prisma = require('../config/prismaClient');
const redis = require('../config/redis');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { success } = require('../utils/responseHelper');
const User = require('../models/userModel');

exports.loginEmployee = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!result) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = new User(result);

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { employeeId: user.employeeId, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await redis.set(`token:${user.employeeId}`, token, 'EX', 3600);

    return success(res, 'Login successful', {
      token,
      user: user.toJSON()
    });

  } catch (err) {
    next(err);
  }
};


exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log("BODY:", req.body);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await prisma.user.findFirst({
      where: {
        email: email,
        is_admin: true
      }
    });

    if (!result) {
      return res.status(401).json({ message: 'User not found or not an admin' });
    }

    const user = new User(result);

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { employeeId: user.employeeId, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await redis.set(`token:${user.employeeId}`, token, 'EX', 3600);

    return success(res, 'Login successful', {
      token,
      admin: {
        id: user.employeeId,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { employeeId } = req.user;

    await redis.del(`token:${employeeId}`);

    return success(res, 'Logout successful');
  } catch (err) {
    next(err);
  }
};

