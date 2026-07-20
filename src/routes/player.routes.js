const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controller');

router.get('/', playerController.getAllPlayers);
router.get('/team/:teamId', playerController.getPlayersByTeam);
router.post('/', playerController.createPlayer);

module.exports = router;