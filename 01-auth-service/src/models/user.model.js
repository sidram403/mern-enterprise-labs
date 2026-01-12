import mongoose from "mongoose";

/**
 * User Schema
 * This schema is responsible ONLY for authentication-related data.
 * Business-specific user data should live in other services.
 */
const userSchema = new mongoose.Schema(
  {
    /**
     * Email is the primary identifier for a user.
     * - Stored in lowercase to avoid duplicates due to case differences
     * - Unique index ensures database-level uniqueness (race-condition safe)
     */
    email: {
      type: String,
      required: true,
      lowercase: true, // converts email to lowercase before saving
      trim: true, // removes accidental spaces
      unique: true, // creates unique index in MongoDB
      index: true, // improves lookup performance (login)
    },

    /**
     * Password is stored as a HASH, never plain text.
     * Hashing logic will be handled using bcrypt (next step).
     */
    password: {
      type: String,
      required: true,
    },

    /**
     * Role is used for authorization (RBAC).
     * Keeping enum prevents invalid role values.
     */
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    /**
     * Automatically adds:
     * - createdAt
     * - updatedAt
     * Useful for auditing and debugging
     */
    timestamps: true,
  }
);

/**
 * Exporting the User model
 * MongoDB collection name will be: users
 */
const User = mongoose.model("User", userSchema);

export default User;
