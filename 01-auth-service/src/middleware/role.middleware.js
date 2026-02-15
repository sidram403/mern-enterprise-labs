/**
 * Role-based authorization middleware
 * Usage: authorize("ADMIN")
 */

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: Insufficient permissions",
      });
    }

    next();
  };
};
