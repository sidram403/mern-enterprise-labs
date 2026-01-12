import mongoose from "mongoose";

/**
  Step 1 : Centralized DB logic -> reusable & testable
  Step 2 : async/await -> non-blocking startup
  Step 3 : process.exit(1) -> fail fast (enterprise rule)
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed", error.message);
    process.exit(1);
  }
};

export default connectDB;
