const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { success } = require('../utils/responseHelper');
const User = require('../models/userModel');
const prisma = require('../config/prismaClient');
const timeHelper = require('../utils/timeHelper'); 
const { publishUpdateProfileLog } = require('../queue/publisher');


exports.getProfile = async (req, res, next) => {
  try {
    const { employeeId } = req.user;

    const result = await prisma.user.findUnique({
      where: { employee_id: Number(employeeId) }
    });

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    const employee = new User(result);

    return success(res, 'Profile fetched successfully', employee.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.editProfile = async (req, res, next) => {
  try {
    const { employeeId } = req.user;
    const body = req.body || {};
    const { phone, oldPassword, newPassword } = body;
    const photoPath = req.file ? req.file.filename : null;

    if (!phone && !photoPath && !newPassword) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const updateData = {};

    const oldUser = await prisma.user.findUnique({
      where: { employee_id: Number(employeeId) },
    });

    if (!oldUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (phone) updateData.phone = phone;
    if (photoPath) updateData.photo = photoPath;

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: 'Old password is required to change password' });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Old password is incorrect' });
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { employee_id: Number(employeeId) },
      data: updateData,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updated = await prisma.user.findUnique({
      where: { employee_id: Number(employeeId) },
    });

    await publishUpdateProfileLog(oldUser, updated, employeeId);

    return success(res, 'Profile updated successfully', updatedUser);
  } catch (err) {
    next(err);
  }
};

exports.clockInOut = async (req, res, next) => {
  try {
    const { employeeId } = req.user;
    const { type } = req.body;

    if (!type || !['clock_in', 'clock_out'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type. Use clock_in or clock_out' });
    }

    const now = timeHelper().tz('Asia/Jakarta');
    const today = new Date(now.format('YYYY-MM-DD'));
    const timestamp = now.toDate();

    const result = await prisma.attendance.findFirst({
      where: {employee_id: Number(employeeId), date: today}
    });

    const attendance = result;

    if (type === 'clock_in') {
      if (attendance && attendance.in_time) {
        return res.status(400).json({ message: 'Already clocked in today.' });
      }

      let saved;

      if (attendance) {
        saved = await prisma.attendance.update({
          where: { id: attendance.id },
          data: { in_time: timestamp  },
        });
      } else {
        saved = await prisma.attendance.create({
          data: {
            employee_id: employeeId,
            date: today,
            in_time: timestamp ,
          },
        });
      }

      await publish('attendance_log', {
        type: 'clock_in',
        employeeId,
        timestamp: timestamp ,
      });

      return success(res, 'Clock-in successful', saved);
    }

    if (type === 'clock_out') {
      if (!attendance || !attendance.in_time) {
        return res.status(400).json({ message: 'You must clock in before clocking out.' });
      }
      if (attendance.out_time) {
        return res.status(400).json({ message: 'Already clocked out today.' });
      }

      saved = await prisma.attendance.update({
        where: { id: attendance.id },
        data: { out_time: timestamp  },
      });

      await publish('attendance_log', {
        type: 'clock_out',
        employeeId,
        timestamp: timestamp ,
      });

      return success(res, 'Clock-out successful', saved);
    }

    return res.status(400).json({ message: 'Invalid request.' });
  } catch (err) {
    next(err);
  }
};

exports.getAttendance = async (req, res, next) => {
  try {
    const { employeeId } = req.user;
    const now = timeHelper().tz('Asia/Jakarta');
    const today = new Date(now.format('YYYY-MM-DD'));

    const result = await prisma.attendance.findFirst({
      where: {
        employee_id: Number(employeeId),
        date: today
      },
    });

    const attendance = result;

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
    next(err);
  }
};

exports.attendanceSummary = async (req, res, next) => {
  try {
    const { employeeId } = req.user;
    const { dateFrom, dateTo } = req.query;

    if ((dateFrom && !dateTo) || (!dateFrom && dateTo)) {
      return res.status(400).json({ message: 'Both dateFrom and dateTo must be provided' });
    }

    const startOfDay = new Date(dateTo)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay  = new Date(dateTo)
    endOfDay .setHours(23, 59, 59, 999)

    const result = await prisma.attendance.findMany({
      where: {
        employee_id: Number(employeeId),
        ...(startOfDay && endOfDay && {
          date: {
            gte: new Date(startOfDay),
            lte: new Date(endOfDay)
          }
        })
      },
      orderBy: {
        date: 'desc'
      },
      select: {
        date: true,
        in_time: true,
        out_time: true
      }
    });

    return success(res, 'Attendance summary fetched', {
      total: result.rowCount,
      summary: result
    });
  } catch (err) {
    next(err);
  }
};
