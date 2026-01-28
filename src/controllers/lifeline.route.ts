import express from "express";
import { useFreezeLifeline } from "../controllers/lifeline.controller";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/freeze", authMiddleware, useFreezeLifeline);

export default router;
