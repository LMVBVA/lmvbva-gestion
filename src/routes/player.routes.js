const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.get('/', requireAuth, playerController.getAllPlayers);
router.get('/team/:teamId', requireAuth, playerController.getPlayersByTeam);
router.post('/', requireAuth, playerController.createPlayer);
router.put('/:id', requireAuth, playerController.updatePlayer);
router.patch('/:id/active', requireAuth, playerController.togglePlayerActive);

module.exports = router;