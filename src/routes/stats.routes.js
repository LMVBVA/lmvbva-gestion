const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.get('/player/:playerId', requireAuth, statsController.getPlayerStats);
router.get('/team/:teamId', requireAuth, statsController.getTeamStats);

module.exports = router;