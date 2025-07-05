const Joi = require('joi');

exports.validateGetEmployees = (req, res, next) => {
  const schema = Joi.object({
    employeeId: Joi.number().integer().optional(),
    name: Joi.string().optional(),
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

exports.validateCreateEmployee = (req, res, next) => {
  if (req.body.photo) {
    delete req.body.photo;
  }

  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().max(50).email().required(),
    phone: Joi.string().allow(null, '').pattern(/^[0-9]+$/).min(3).max(20).optional(),
    position: Joi.string().min(2).max(50).required(),
    isAdmin: Joi.boolean().optional(),
    status: Joi.string().valid('active', 'inactive').required(),
    password: Joi.string().min(6).max(32).optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

exports.validateEditEmployee = (req, res, next) => {
  if (req.body.photo) {
      delete req.body.photo;
    }

  const schema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    email: Joi.string().max(50).email().optional(),
    phone: Joi.string().pattern(/^[0-9]+$/).min(3).max(20).optional(),
    position: Joi.string().min(2).max(50).optional(),
    isAdmin: Joi.boolean().optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
    password: Joi.string().min(6).max(32).optional(),
  }).or('name', 'phone', 'position', 'isAdmin', 'status', 'password');

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

exports.validateGetAttendances = (req, res, next) => {
  const schema = Joi.object({
    employeeId: Joi.number().integer().optional(),
    dateFrom: Joi.date().iso().optional(),
    dateTo: Joi.date().iso().optional(),
    name: Joi.string().optional(),
  }).and('dateFrom', 'dateTo');

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

exports.validateGetLogs = (req, res, next) => {
  const schema = Joi.object({
    employeeId: Joi.number().integer().required(),
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
