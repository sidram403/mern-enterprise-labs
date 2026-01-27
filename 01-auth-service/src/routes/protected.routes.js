import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Example protected route
 */
router.get("/profile", authenticate, (req, res) => {
  res.status(200).json({
    message: "Access granted",
    user: req.user,
  });
});

export default router;
