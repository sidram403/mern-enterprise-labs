import jwt from "jsonwebtoken";

/**
 * Generate short-lived acces token
 * Used to access protected APIs
 */

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m", // short-lived for security
  });
};

/**
 * Generate long-lived refresh token
 * Used only to get new access tokens
 */

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d", // longer lifespan
  });
};
