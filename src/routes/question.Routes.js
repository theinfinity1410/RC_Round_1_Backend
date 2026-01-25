const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const firstQuestion = require('../controllers/question/firstQuestion.controller');

const router = express.Router();

// POST /question/send
router.post('/send', authMiddleware, firstQuestion);

module.exports = router;
