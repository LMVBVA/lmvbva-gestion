const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.get('/coaches', requireAuth, teamController.getAllCoaches);
router.get('/', requireAuth, teamController.getAllTeams);
router.get('/:id', requireAuth, teamController.getTeamById);
router.post('/', requireAuth, teamController.createTeam);
router.put('/:id', requireAuth, teamController.updateTeam);
router.patch('/:id/active', requireAuth, teamController.toggleTeamActive);
router.patch('/:id/season', requireAuth, teamController.updateSeasonDates);
router.post('/:id/coach', requireAuth, teamController.assignCoach);

module.exports = router;