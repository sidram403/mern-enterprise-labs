import mongoose from "mongoose";

/**
 * User Model
 * Represents registered users in the system
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true, // improves analytics queries
    },
  },
  {
    timestamps: true, // needed for monthly user analytics
  },
);

const User = mongoose.model("User", userSchema);

export default User;
