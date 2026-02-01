import express from 'express';
import leaderboardController from '../controllers/leaderboard.controller.js';

const router = express.Router();

router.get('/', leaderboardController.getLeaderboard);

router.get('/rank', leaderboardController.getUserRank);

export default router;
