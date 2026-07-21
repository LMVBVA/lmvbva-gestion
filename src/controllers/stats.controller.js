const statsService = require('../services/stats.service');

async function getPlayerStats(req, res) {
  try {
    const stats = await statsService.getPlayerStats(req.params.playerId);
    return res.json({ success: true, data: stats });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

async function getTeamStats(req, res) {
  try {
    const stats = await statsService.getTeamStats(req.params.teamId);
    return res.json({ success: true, data: stats });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

module.exports = { getPlayerStats, getTeamStats };