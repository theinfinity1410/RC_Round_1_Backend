import express from 'express';
import {flip} from '../controllers/flip.js';
import {freeze} from '../controllers/freeze.js';
import {hint} from '../controllers/hint.js';
import authMiddleware from "../middlewares/auth.js";

const lifelinesRouter = express.Router();

lifelinesRouter.post("/flip", flip);
// lifelinesRouter.post('/freeze', freeze);
lifelinesRouter.post("/hint", hint);


export default lifelinesRouter;
