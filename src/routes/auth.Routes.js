
import express from 'express';

import login from '../controllers/auth.controller.js';
// import login from '../src/controllers/auth.controller.js';

const router = express.Router();

router.post('/login', login);

export default router;
