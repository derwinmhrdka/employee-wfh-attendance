const prisma = require('../config/prismaClient');
const bcrypt = require('bcrypt');
const { success, error } = require('../utils/responseHelper');
const timeHelper = require('../utils/timeHelper');
const logger = require('../utils/logger');
const User = require('../models/userModel');
const Attendance = require('../models/attendanceModel');
const Logs = require('../models/logModel');

exports.getEmployees = async (req, res, next) => {
  try {
    const { employeeId, name } = req.query;

    const whereClause = {};

    if (employeeId) {
      whereClause.employee_id = Number(employeeId);
    }

    if (name) {
      whereClause.name = {
        contains: name,
        mode: 'insensitive'
      };
    }

    const result = await prisma.user.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      orderBy: {
        employee_id: 'asc',
      },
      select: {
        employee_id: true,
        name: true,
        email: true,
        phone: true,
        photo: true,
        position: true,
        is_admin: true,
        status: true,
      }
    });

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No employee data found",
        data: null,
      });
    }

    const employees = result.map(row => new User(row).toJSON());

    return success(res, 'Employees fetched successfully', employees);
  } catch (err) {
    logger.error('getEmployees failed', err);
    next(err);
  }
};


exports.createEmployee = async (req, res, next) => {
  try {
    let {
      name, email, phone, position, isAdmin, status, password
    } = req.body;

    const photoPath = req.file ? req.file.filename : null;

    if (!name || !email || !position || !status) {
      return error(res, 'Name, email, position, and status are required.', 400);
    }

    const check = await prisma.user.findUnique({
      where: { email: email }
    });

    if (check) {
      return error(res, 'Email already exists.', 400);
    }

    if (!password) {
      password = 'WHATT072025'; // Default fallback
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.user.create({
      data: {
        name: name,
        email: email,
        phone: phone || null,
        photo: photoPath,
        position: position || null,
        is_admin: isAdmin === 'true' || isAdmin === true,
        status: status.toLowerCase(),
        password: hashedPassword,
      },
      select: {
        employee_id: true,
        name: true,
        email: true,
        phone: true,
        photo: true,
        position: true,
        is_admin: true,
        status: true,
      },
    });

    return success(res, 'Employee created successfully', result);
  } catch (err) {
    logger.error('createEmployee failed', err);
    next(err);
  }
};

exports.editEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { name, phone, position, status, isAdmin, password } = req.body;
    const photoPath = req.file ? req.file.filename : null;

    if (!employeeId) {
      return error(res, 'employeeId is required in URL params.', 400);
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (photoPath) updateData.photo = photoPath;
    if (position) updateData.position = position;
    if (status) updateData.status = status.toLowerCase();
    if (typeof isAdmin !== 'undefined') {
      updateData.is_admin = isAdmin === 'true' || isAdmin === true;
    }
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return error(res, 'No fields to update.', 400);
    }

    const existing = await prisma.user.findUnique({
      where: { employee_id: Number(employeeId) },
    });

    if (!existing) {
      return error(res, 'Employee not found.', 404);
    }

    const result = await prisma.user.update({
      where: { employee_id: Number(employeeId) },
      data: updateData,
      select: {
        employee_id: true,
        name: true,
        email: true,
        phone: true,
        photo: true,
        position: true,
        status: true,
        is_admin: true
      },
    });

    return success(res, 'Employee updated successfully', result);
  } catch (err) {
    logger.error('editEmployee failed', err);
    next(err);
  }
};

exports.getAttendances = async (req, res, next) => {
  try {
    const {name, employeeId, dateFrom, dateTo } = req.query;

    if ((dateFrom && !dateTo) || (!dateFrom && dateTo)) {
      return error(res, 'Both dateFrom and dateTo must be provided together.', 400);
    }

    if (dateFrom > dateTo) {
      return error(res, 'dateFrom must be greater than dateTo', 400);
    }

    const whereClause = {};

    if (employeeId) {
      whereClause.employee_id = Number(employeeId);
    }

    if (name) {
      whereClause.user = {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      };
    }

    if (dateFrom && dateTo) {
      whereClause.date = {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      };
    }

    const result = await prisma.attendance.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        { date: 'desc' },
        { in_time: 'desc' },
        { out_time: 'desc' },
        { id: 'asc' }
      ]
    });

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attendance data found",
        data: null,
      });
    }

    const attendance = result.map(row => {
      const plain = new Attendance(row).toJSON();
      return {
        ...plain,
        date: row.date ? timeHelper(row.date).tz('Asia/Jakarta').format('YYYY-MM-DD') : null,
        name: row.user?.name || null
      };
    });

    return success(res, 'Attendance records fetched successfully', {
      total: attendance.length,
      data: attendance
    });
  } catch (err) {
    logger.error('getAttendances failed', err);
    next(err);
  }
};

exports.getLogs = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    const result = await prisma.LogUpdateProfile.findMany({
      where: { employee_id: Number(employeeId) },
      orderBy: {
        updated_at: 'desc'
      },
      select: {
        employee_id: true,
        old_value: true,
        new_value: true,
        changed_field: true,
        updated_at: true,
      }
    });

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No logs found",
        data: null,
      });
    }

    const logs = result.map(row => new Logs(row).toJSON());

    return success(res, 'Logs fetched successfully', logs);
  } catch (err) {
    logger.error('getLogs failed', err);
    next(err);
  }
};
