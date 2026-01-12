import mongoose from "mongoose";

// Step 1 : Centralized DB logic -> reusable & testable
const connectDB = async () => {
  // Step 2 : async/await -> non-blocking startup
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed", error.message);

    // Step 3 : process.exit(1) -> fail fast (enterprise rule)
    process.exit(1);
  }
};

export default connectDB;
