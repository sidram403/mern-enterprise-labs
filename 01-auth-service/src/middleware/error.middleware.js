import logger from "../utils/logger.js";

/**
 * Global error handling middleware
 * Must be the LAST middleware registred in app.js
 */
export const errorHandler = (err, req, res, next) => {
  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
  });

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
};
