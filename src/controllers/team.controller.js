const teamService = require('../services/team.service');

async function getAllTeams(req, res) {
  try {
const teams = await teamService.getAllTeams(req.user);
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

async function getAllCoaches(req, res) {
  try {
    const coaches = await teamService.getAllCoaches();
    return res.json({ success: true, data: coaches });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

async function assignCoach(req, res) {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, error: 'userId est requis.' });
  }
  try {
    const result = await teamService.assignCoach(req.params.id, userId);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

module.exports = { getAllTeams, getTeamById, getAllCoaches, assignCoach };