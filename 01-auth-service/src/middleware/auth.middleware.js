import jwt from "jsonwebtoken";

/**
 * Authentication middlewaare
 * Verifies access token and allows request too proceed
 */

export const authenticate = (req, res, next) => {
  try {
    /**
     * Expect toekn in Authorization header
     * Format: Bearer <token>
     */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify toekn
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    /**
     * Attach decoded user info to request
     * So downstream controllers can use it
     */
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
