const pool = require('../config/db');
const prisma = require('../config/prismaClient');
const bcrypt = require('bcrypt');
const { success } = require('../utils/responseHelper');
const User = require('../models/userModel');
const Attendance = require('../models/attendanceModel');

exports.getEmployees = async (req, res, next) => {
  try {
    const { employeeId } = req.query;

    const result = await prisma.user.findMany({
      where: employeeId
        ? { employee_id: Number(employeeId) } 
        : {}, 
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

    const employees = result.map(row => new User(row).toJSON());

    return success(res, 'Employees fetched successfully', employees);
  } catch (err) {
    next(err);
  }
};

exports.createEmployee = async (req, res, next) => {
  try {
    const {
      name, email, phone, photo, position, isAdmin, status, password
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const check = await prisma.user.findUnique({
      where: { email: email }
    });

    if (check) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.user.create({
      data: {
        name: name,
        email: email,
        phone: phone || null,
        photo: photo || null,
        position: position || null,
        is_admin: isAdmin === true, 
        status: status || 'active',
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
    next(err);
  }
};

exports.editEmployee = async (req, res, next) => {
  try {
    const admin = req.user;
    const { employeeId } = req.params;
    const { name, phone, photo, position, status, password } = req.body;

    if (!admin?.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Only admin can edit employees.' });
    }

    if (!employeeId) {
      return res.status(400).json({ message: 'employeeId is required in URL params.' });
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (photo) updateData.photo = photo;
    if (position) updateData.position = position;
    if (status) updateData.status = status;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields to update.' });
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
    next(err);
  }
};

exports.getAttendances = async (req, res, next) => {
  try {
    const admin = req.user;
    const { employeeId, dateFrom, dateTo } = req.query;

    if (!admin?.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Only admin can fetch attendance records.' });
    }

    if ((dateFrom && !dateTo) || (!dateFrom && dateTo)) {
      return res.status(400).json({ message: 'Both dateFrom and dateTo must be provided together.' });
    }

    const where = {};

    if (employeeId) {
      where.employee_id = Number(employeeId);
    }

    if (dateFrom && dateTo) {
      where.date = {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      };
    }

    const result = await prisma.attendance.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    const attendance = result.map(row => new Attendance(row).toJSON());

    return success(res, 'Attendance records fetched successfully', {
      total: attendance.length,
      data: attendance
    });
  } catch (err) {
    next(err);
  }
};
