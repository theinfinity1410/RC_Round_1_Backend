const express = require('express');
const login = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', login);

router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'This is a protected route',
    userId: req.user.id
  });
});

module.exports = router;
