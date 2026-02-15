import express from 'express';
import {flip} from '../controllers/flip.js';
import {useFreezeLifeline} from '../controllers/freeze.js';
import {hint} from '../controllers/hint.js';
import authMiddleware from "../middlewares/auth.js";

const lifelinesRouter = express.Router();

lifelinesRouter.post("/flip", authMiddleware, flip);
lifelinesRouter.post('/freeze', useFreezeLifeline);
lifelinesRouter.post("/hint", authMiddleware, hint);


export default lifelinesRouter;