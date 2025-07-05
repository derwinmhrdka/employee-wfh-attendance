const { success, error } = require('../utils/responseHelper');
const User = require('../models/userModel');
const prisma = require('../config/prismaClient');
const timeHelper = require('../utils/timeHelper');
const { publishUpdateProfileLog } = require('../queue/publisher');
const logger = require('../utils/logger');

exports.getProfile = async (req, res, next) => {
  try {
    const { employeeId } = req.user;

    const result = await prisma.user.findUnique({
      where: { employee_id: Number(employeeId) }
    });

    if (!result) {
      return error(res, 'User not found', 404);
    }

    const employee = new User(result);

    return success(res, 'Profile fetched successfully', employee.toJSON());
  } catch (err) {
    logger.error('getProfile failed', err);
    next(err);
  }
};

exports.editProfile = async (req, res, next) => {
  const prisma = require('../config/prismaClient');
  const bcrypt = require('bcrypt');

  try {
    const { employeeId } = req.user;
    const { phone, oldPassword, newPassword } = req.body || {};
    const photoPath = req.file ? req.file.filename : null;

    await prisma.$transaction(async (tx) => {
      const oldUser = await tx.user.findUnique({
        where: { employee_id: Number(employeeId) },
      });

      if (!oldUser) {
        throw { status: 404, message: 'User not found' };
      }

      const updateData = {};
      if (phone) updateData.phone = phone;
      if (photoPath) updateData.photo = photoPath;

      if (newPassword) {
        const isMatch = await bcrypt.compare(oldPassword, oldUser.password);
        if (!isMatch) {
          throw { status: 400, message: 'Old password is incorrect' };
        }
        updateData.password = await bcrypt.hash(newPassword, 10);
      }

      const updatedUser = await tx.user.update({
        where: { employee_id: Number(employeeId) },
        data: updateData,
      });

      await publishUpdateProfileLog(oldUser, updatedUser, employeeId);

      return success(res, 'Profile updated successfully', updatedUser);
    });

  } catch (err) {
    logger.error('editProfile failed', err);
    next(err);
  }
};

exports.clockInOut = async (req, res, next) => {
  try {
    const { employeeId } = req.user;
    const { type } = req.body;

    if (!type || !['clock_in', 'clock_out'].includes(type)) {
      return error(res, 'Invalid type. Use clock_in or clock_out', 400);
    }

    const now = timeHelper().tz('Asia/Jakarta');
    const today = new Date(now.format('YYYY-MM-DD'));
    const timestamp = now.toDate();

    const attendance = await prisma.attendance.findFirst({
      where: { employee_id: Number(employeeId), date: today }
    });

    if (type === 'clock_in') {
      if (attendance && attendance.in_time) {
        return error(res, 'Already clocked in today.', 400);
      }

      let saved;
      if (attendance) {
        saved = await prisma.attendance.update({
          where: { id: attendance.id },
          data: { in_time: timestamp },
        });
      } else {
        saved = await prisma.attendance.create({
          data: {
            employee_id: employeeId,
            date: today,
            in_time: timestamp,
          },
        });
      }

      return success(res, 'Clock-in successful', saved);
    }

    if (type === 'clock_out') {
      if (!attendance || !attendance.in_time) {
        return error(res, 'You must clock in before clocking out.', 400);
      }
      if (attendance.out_time) {
        return error(res, 'Already clocked out today.', 400);
      }

      const saved = await prisma.attendance.update({
        where: { id: attendance.id },
        data: { out_time: timestamp },
      });

      return success(res, 'Clock-out successful', saved);
    }

    return error(res, 'Invalid request.', 400);
  } catch (err) {
    logger.error('clockInOut failed', err);
    next(err);
  }
};

exports.getAttendance = async (req, res, next) => {
  try {
    const { employeeId } = req.user;
    const now = timeHelper().tz('Asia/Jakarta');
    const today = new Date(now.format('YYYY-MM-DD'));

    const attendance = await prisma.attendance.findFirst({
      where: {
        employee_id: Number(employeeId),
        date: today
      },
    });

    let status = 'Not clocked in';
    if (attendance?.in_time && !attendance?.out_time) {
      status = 'Clocked in';
    } else if (attendance?.in_time && attendance?.out_time) {
      status = 'Clocked out';
    }

    return success(res, 'Today\'s attendance fetched', {
      date: today,
      clockIn: attendance?.in_time || null,
      clockOut: attendance?.out_time || null,
      status
    });
  } catch (err) {
    logger.error('getAttendance failed', err);
    next(err);
  }
};

exports.attendanceSummary = async (req, res, next) => {
  try {
    const { employeeId } = req.user;
    const { dateFrom, dateTo } = req.query;

    if ((dateFrom && !dateTo) || (!dateFrom && dateTo)) {
      return error(res, 'Both dateFrom and dateTo must be provided', 400);
    }

    const startOfDay = new Date(dateFrom);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dateTo);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await prisma.attendance.findMany({
      where: {
        employee_id: Number(employeeId),
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      orderBy: { date: 'desc' },
      select: {
        date: true,
        in_time: true,
        out_time: true
      }
    });

    return success(res, 'Attendance summary fetched', {
      total: result.length,
      summary: result
    });
  } catch (err) {
    logger.error('getAttendanceSummary failed', err);
    next(err);
  }
};
