import express from "express";
import { useFreezeLifeline } from "../controllers/freeze.controller";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/freeze", authMiddleware, freezeMiddleware, useFreezeLifeline);

export default router;