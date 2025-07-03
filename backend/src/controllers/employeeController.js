const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { success } = require('../utils/responseHelper');
const User = require('../models/userModel');
const prisma = require('../config/prismaClient');
const { publish } = require('../queue/publisher');

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
    const { phone, photo, oldPassword, newPassword } = req.body;

    if (!phone && !photo && !newPassword) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const updateData = {};

    if (phone) updateData.phone = phone;
    if (photo) updateData.photo = photo;

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: 'Old password is required to change password' });
      }

      const userPassword = await prisma.user.findUnique(
        { where: { employee_id: Number(employeeId) }
      });

      if (!userPassword) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(oldPassword, userPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Old password is incorrect' });
      }

      updateData.newPassword = await bcrypt.hash(newPassword, 10);
    }

    const result = await prisma.user.update({
      where: { employee_id: Number(employeeId) },
      data: updateData,
      select: {
        employee_id: true,
        name: true,
        phone: true,
        photo: true,
      }
    });

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    return success(res, 'Profile updated successfully', result);
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

    const today = new Date()
    today.setHours(0, 0, 0, 0);

    const now = new Date();

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
          data: { in_time: now },
        });
      } else {
        saved = await prisma.attendance.create({
          data: {
            employee_id: employeeId,
            date: today,
            in_time: now,
          },
        });
      }

      await publish('attendance_log', {
        type: 'clock_in',
        employeeId,
        timestamp: now,
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
        data: { out_time: now },
      });

      await publish('attendance_log', {
        type: 'clock_out',
        employeeId,
        timestamp: now,
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
    const today = new Date()
    today.setHours(0, 0, 0, 0);

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

    const result = await prisma.attendance.findMany({
      where: {
        employee_id: Number(employeeId),
        ...(dateFrom && dateTo && {
          date: {
            gte: new Date(dateFrom),
            lte: new Date(dateTo)
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
