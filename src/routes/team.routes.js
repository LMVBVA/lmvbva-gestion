const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.get('/', requireAuth, teamController.getAllTeams);
router.get('/:id', requireAuth, teamController.getTeamById);

module.exports = router;