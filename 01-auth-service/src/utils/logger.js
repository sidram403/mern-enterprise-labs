import winston from "winston";

/**
 * Winston Logger Configuration
 * - Console logs for development
 * - File logs for production debugging
 */
export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    // Log to console
    new winston.transports.Console(),

    // Log errors to file
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // Log all info logs
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

export default logger;
