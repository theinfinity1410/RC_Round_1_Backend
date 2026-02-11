import express from 'express';
import {start} from '../controllers/start.js';
import {next} from '../controllers/next.js';
import {submit} from '../controllers/submit.js'
import { getLeaderboard, getUserRank } from '../controllers/leaderboard.js';

const quizRouter = express.Router();

quizRouter.post('/start', start);
 quizRouter.post('/next', next);
quizRouter.post('/leaderboard', getLeaderboard);
quizRouter.get('/leaderboard/rank', getUserRank);
quizRouter.post('/submit', submit);

export default quizRouter;