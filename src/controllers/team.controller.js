const teamService = require('../services/team.service');

async function getAllTeams(req, res) {
  try {
    const teams = await teamService.getAllTeams();
    return res.json({ success: true, data: teams });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

async function getTeamById(req, res) {
  try {
    const team = await teamService.getTeamById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, error: 'Équipe introuvable.' });
    }
    return res.json({ success: true, data: team });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

module.exports = { getAllTeams, getTeamById };