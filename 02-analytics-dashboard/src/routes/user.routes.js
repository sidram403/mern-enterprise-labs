import express from "express";
import { createUser } from "../controllers/user.controller.js";

const router = express.Router();

/**
 * POST /api/users
 */
router.post("/", createUser);

export default router;
