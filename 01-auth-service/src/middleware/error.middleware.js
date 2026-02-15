/**
 * Global error handling middleware
 * Must be the LAST middleware registred in app.js
 */

export const errorHandler = (err, req, res, next) => {
  console.error("Global Error", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
};
