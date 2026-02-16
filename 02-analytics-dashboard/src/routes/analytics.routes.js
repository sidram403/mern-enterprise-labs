import express from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

/**
 * Admin analytics endpoint
 */
router.get("/analytics", getAnalytics);

export default router;
