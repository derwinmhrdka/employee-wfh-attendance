// middlewares/validators/profileValidator.js
const Joi = require('joi');

exports.validateEditProfile = (req, res, next) => {
  const schema = Joi.object({
    phone: Joi.string().optional(),
    oldPassword: Joi.string().optional(),
    newPassword: Joi.when('oldPassword', {
      is: Joi.exist(),
      then: Joi.string().required(),
      otherwise: Joi.string().optional(),
    }),
  }).or('phone', 'newPassword');

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

exports.validateClockInOut = (req, res, next) => {
  const schema = Joi.object({
    type: Joi.string().valid('clock_in', 'clock_out').required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

exports.validateAttendanceSummary = (req, res, next) => {
  const schema = Joi.object({
    dateFrom: Joi.date().iso().optional(),
    dateTo: Joi.date().iso().optional(),
  }).and('dateFrom', 'dateTo');

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
