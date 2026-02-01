const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const quizCtrl = require('../controllers/quiz');

// NEXT button 
router.post('/next', auth, quizCtrl.nextQuestion);

// SUBMIT Button
router.post('/submit', auth, quizCtrl.finalSubmit);

module.exports = router;
