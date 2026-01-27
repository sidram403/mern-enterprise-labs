import User from "../models/user.model.js";

/**
 * Register a new user
 * This controller handles:
 * - user creation
 * - duplicate email errors
 * - clean API response
 */
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    /**
     * Basic validation
     * (We’ll replace this later with Zod/Joi)
     */

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

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
