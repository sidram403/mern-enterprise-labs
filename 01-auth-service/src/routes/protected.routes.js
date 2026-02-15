import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

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

router.get("/admin", authenticate, authorize("ADMIN"), (req, res) => {
  res.status(200).json({ message: "Admin access granted" });
});

export default router;
