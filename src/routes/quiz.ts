import express from 'express';
import {start} from '../controllers/start.js';
import {next} from '../controllers/next.js';
import {leaderboard} from '../controllers/leaderboard.js';
import {submit} from '../controllers/submit.js'

const quizRouter = express.Router();

// quizRouter.post('/start', start);
// quizRouter.post('/next', next);
// quizRouter.post('/leaderboard', leaderboard);
// quizRouter.post('/submit', submit);

export default quizRouter;