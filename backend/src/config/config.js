const Joi = require('joi');
require('dotenv').config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().uri().required(),
  RABBITMQ_URL: Joi.string().uri().required(),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Env validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  dbUrl: envVars.DATABASE_URL,
  rabbitUrl: envVars.RABBITMQ_URL,
  redisUrl: envVars.REDIS_URL,
};
