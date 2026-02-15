import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import jwt from "jsonwebtoken";
import { registerSchema } from "../validation/auth.validation.js";
import { ZodError } from "zod";
/**
 * Register a new user
 * This controller handles:
 * - user creation
 * - duplicate email errors
 * - clean API response
 */
export const registerUser = async (req, res) => {
  try {
    /**
     * Validate request body using Zod
     * If invalid -> Zod throws error automatically
     */
    const validatedData = registerSchema.parse(req.body);

    const { email, password } = validatedData;

    /**
     * Optional pre-check for better UX
     * NOT relied on for data integrity
     */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    /**
     * Create user
     * Password hashing is handled automatically by model hook
     */
    const user = await User.create({ email, password });

    /**
     * Never send password back in response
     */
    res.status(201).json({
      id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    /**
     * Handle Zod validation errors
     */
    if (error.name === "ZodError") {
      try {
        const parsed = JSON.parse(error.message);
        return res.status(400).json({
          message: parsed[0].message,
        });
      } catch {
        return res.status(400).json({
          message: "Invalid request data",
        });
      }
    }

    /**
     * Handle MongoDB duplicate key error (race condition safe)
     */
    if (error.code === 11000) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    console.error("Registration error", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "User not exists",
      });
    }

    // Compare passowrd
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentails",
      });
    }

    // Generate tokens
    const payload = { userId: user._id, role: user.role };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token in database
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * Refresh access token using refresh token
 */

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required",
      });
    }

    //verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({
        message: "Invalid refresh token",
      });
    }

    // Check if refresh token exists in DB
    if (!user.refreshTokens.includes(refreshToken)) {
      return res.status(403).json({
        message: "Refresh token not recognised",
      });
    }

    /**
     * ROTATION:
     * Remove old refresh token
     */
    user.refreshTokens = user.refreshTokens.filter(
      (token) => token !== refreshToken,
    );

    /**
     * Generate new access token
     * Using same payload
     */
    const newAccessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user._id,
      role: user.role,
    });

    // Store new refresh token
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired refresh token",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({
        message: "Invalid token",
      });
    }

    // Remove refresh token
    user.refreshTokens = user.refreshTokens.filter(
      (token) => token !== refreshToken,
    );

    await user.save();

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(403).json({
      message: "Invalid token",
    });
  }
};
