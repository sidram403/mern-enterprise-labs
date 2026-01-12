import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
 * Pre-save hook
 * This runs automatically before a document is saved to MongoDB.
 * We use it to hash the password safely.
 */

userSchema.pre("save", async function (next) {
  /**
   * `this` refers to the current document
   * If password is NOT modified, skip hashing
   * This prevents re-hashing during updates
   */
  if (!this.isModified("password")) {
    return next();
  }

  try {
    /**
     * Generate salt
     * Higher rounds = more secure but slower
     * 10 is a good production balance
     */
    const salt = await bcrypt.genSalt(10);

    /**
     * Hash the password using the generated salt
     */
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method to compare entered password with stored hash
 * Used dduring login
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Exporting the User model
 * MongoDB collection name will be: users
 */
const User = mongoose.model("User", userSchema);

export default User;
