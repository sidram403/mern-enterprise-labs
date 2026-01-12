import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,

      // unique create a UNIQUE INDEX at database level
      // prevents duplicate users even under high concurrency
      unique: true,

      // trim removes accidental spaces
      trim: true,

      // lowercase ensures consistent storage
      lowercase: true,
    },
    password: {
      type: String,
      required: true,

      // password is never returned by default in queries
      select: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    // automatically adds createdAt & updatedAt
    timestamps: true,
  }
);

// explicit index definition (best practice)
userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);

export default User;
