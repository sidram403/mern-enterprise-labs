import User from "../models/user.model.js";
import { createUserSchema } from "../validation/user.validation.js";

/**
 * Create new user
 * Used to generate data for analytics
 */
export const createUser = async (req, res) => {
  try {
    /**
     * Validate request body using Zod
     */
    const validatedData = createUserSchema.parse(req.body);

    const user = await User.create(validatedData);

    res.status(201).json(user);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: JSON.parse(error.message)[0].message,
      });
    }

    console.error("Create user error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
