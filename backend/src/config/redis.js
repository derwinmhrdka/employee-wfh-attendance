const Redis = require('ioredis');
const config = require('../config/config');
const logger = require('../utils/logger');

const redis = new Redis(config.redisUrl); 

redis.on('connect', () => {
  logger.info('Redis connected');
});

redis.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

module.exports = redis;
