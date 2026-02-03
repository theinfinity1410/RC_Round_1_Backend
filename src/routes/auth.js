import express from "express";
import { flipQuestion } from "../controllers/auth.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

/**
 * FLIP QUESTION LIFELINE
 * POST /api/auth/flip
 */
router.post("/flip", authMiddleware, flipQuestion);

export default router;
//hint lifeline below
import { hintLifeline } from "../controllers/auth.js";

router.post("/hint", authMiddleware, hintLifeline);
