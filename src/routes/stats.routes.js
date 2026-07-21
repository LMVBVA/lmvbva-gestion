const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.get('/player/:playerId', requireAuth, statsController.getPlayerStats);
router.get('/team/:teamId', requireAuth, statsController.getTeamStats);
router.get('/team/:teamId/average', requireAuth, statsController.getTeamAverage);

module.exports = router;