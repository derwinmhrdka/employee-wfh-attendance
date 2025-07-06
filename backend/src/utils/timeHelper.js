const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

// Extend plugin-nya di sini
dayjs.extend(utc);
dayjs.extend(timezone);

function getLocalDate() {
  return dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD'); 
}

// Export dayjs yang sudah siap pakai
module.exports = dayjs;
