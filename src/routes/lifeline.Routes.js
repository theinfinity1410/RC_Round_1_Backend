const express = require('express');

const flip = require('../controllers/flip.controller');

const freeze = require('../controllers/freeze.controller');
const hint = require('../controllers/hint.controller');

const authMiddleware = require('../middlewares/authMiddleware');
const validateLifeline = require('../middlewares/lifelineMiddleware');
const handleEdgeCases = require('../middlewares/handleEdgeCases');

const router = express.Router();

router.post(
  '/lifelines/flip',
  authMiddleware,
  validateLifeline,
  handleEdgeCases,
  flip
);

router.post(
  '/lifelines/freeze',
  authMiddleware,
  validateLifeline,
  handleEdgeCases,
  freeze
);

router.post(
  '/lifelines/hint',
  authMiddleware,
  validateLifeline,
  handleEdgeCases,
  hint
);

module.exports = router;
