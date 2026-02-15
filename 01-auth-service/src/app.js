import express from "express";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { rateLimit } from "express-rate-limit";
import morgan from "morgan";
import logger from "./utils/logger.js";

const app = express();

// JSON parser
app.use(express.json());

/**
 * HTTP request logger using Morgan
 * Stream logs into Winston
 */
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

// Rate limiter (GLOBAL protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: "Too many requests, please try again later",
});

app.use(limiter);

// Routes
app.use("/api", protectedRoutes);
app.use("/api/auth", authRoutes);

// Global error handler (always last)
app.use(errorHandler);

export default app;
