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
async function createTeam(req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, error: 'Le nom de l\'équipe est requis.' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'Seul un administrateur peut créer une équipe.' });
  }

  try {
    const team = await teamService.createTeam(name);
    return res.status(201).json({ success: true, data: team });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ success: false, error: 'Une équipe porte déjà ce nom.' });
    }
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}
async function updateTeam(req, res) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Le nom est requis.' });
  }
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'Seul un administrateur peut modifier une équipe.' });
  }
  try {
    const team = await teamService.updateTeam(req.params.id, name);
    return res.json({ success: true, data: team });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ success: false, error: 'Une équipe porte déjà ce nom.' });
    }
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

async function toggleTeamActive(req, res) {
  const { active } = req.body;
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'Seul un administrateur peut désactiver une équipe.' });
  }
  try {
    const team = await teamService.toggleTeamActive(req.params.id, active);
    return res.json({ success: true, data: team });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}
async function updateSeasonDates(req, res) {
  const { seasonStartDate, seasonEndDate } = req.body;

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'Réservé aux administrateurs.' });
  }

  try {
    const team = await teamService.updateSeasonDates(req.params.id, seasonStartDate, seasonEndDate);
    return res.json({ success: true, data: team });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

module.exports = { getAllTeams, getTeamById, getAllCoaches, assignCoach, createTeam, updateTeam, toggleTeamActive, updateSeasonDates };