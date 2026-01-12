import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";

// What problem does dotenv solve in production?
// 'dotenv' keeps secrets and environment-specific configuration outside the codebase,
// allowing CI/CD pipelines to inject securly without exposing them in Git.
dotenv.config();

const PORT = process.env.PORT || 4000;

// Why must DB connect before app.listen()?
// The server should start accepting requests only after critical dependenices (like the database) are ready, otherwise request may fail at runtime.
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
  });
};

startServer();
