const Redis = require('ioredis');
require('dotenv').config(); 

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DATABASE ? Number(process.env.REDIS_DATABASE) : 0,
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

module.exports = redis;
