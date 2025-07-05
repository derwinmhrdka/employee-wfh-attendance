const logger = {
  info: (message, meta = {}) => {
    console.log(`[INFO] ${message}`, meta);
  },

  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${message}`, meta);
  },

  error: (message, error = {}) => {
    console.error(`[ERROR] ${message}`, {
      message: error.message,
      stack: error.stack,
      ...error,
    });
  },
};

module.exports = logger;
