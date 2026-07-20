// server/infrastructure/logger.js
const fs = require('fs');
const path = require('path');

// Simple logger - logs to console and file
const logger = {
  info: (message, data = {}) => {
    const log = `[INFO] ${new Date().toISOString()} - ${message}`;
    console.log(log, data);
  },

  warn: (message, data = {}) => {
    const log = `[WARN] ${new Date().toISOString()} - ${message}`;
    console.warn(log, data);
  },

  error: (message, data = {}) => {
    const log = `[ERROR] ${new Date().toISOString()} - ${message}`;
    console.error(log, data);
  },

  debug: (message, data = {}) => {
    if (process.env.LOG_LEVEL === 'debug') {
      const log = `[DEBUG] ${new Date().toISOString()} - ${message}`;
      console.log(log, data);
    }
  }
};

module.exports = logger;