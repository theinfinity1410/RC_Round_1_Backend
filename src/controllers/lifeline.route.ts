import express from "express";
import { useFreezeLifeline } from "../controllers/lifeline.controller";

const router = express.Router();

router.post("/freeze", useFreezeLifeline);

export default router;
