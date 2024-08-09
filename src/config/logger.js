const { get, isEqual } = require('lodash');
const { createLogger, format, transports } = require('winston');
const { nodeEnv } = require('./app');

// Custom error formatting function
const errorFormatting = format((info) => {
  if (info instanceof Error) {
    return { ...info, message: get(info, 'stack') };
  }

  return info;
});

// Determine the log level based on environment
const logLevel = isEqual(nodeEnv, 'development') ? 'debug' : 'info';

// Define log format for transport
const logFormat = format.combine(
  errorFormatting(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.splat(),
  format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${String(message)}`),
);

// Configure transports
const loggerTransports = [
  new transports.Console({
    stderrLevels: ['error'],
    format: format.combine(isEqual(nodeEnv, 'development') ? format.colorize() : format.uncolorize(), logFormat),
  }),
];

// Create a Winston logger instance
const logger = createLogger({
  level: logLevel,
  format: logFormat,
  transports: loggerTransports,
});

module.exports = logger;
