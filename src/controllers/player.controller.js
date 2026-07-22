const playerService = require('../services/player.service');

async function getAllPlayers(req, res) {
  try {
    const players = await playerService.getAllPlayers();
    return res.json({ success: true, data: players });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

async function getPlayersByTeam(req, res) {
  try {
    const players = await playerService.getPlayersByTeam(req.params.teamId);
    return res.json({ success: true, data: players });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

async function createPlayer(req, res) {
  const { firstName, lastName, teamId } = req.body;

  if (!firstName || !lastName || !teamId) {
    return res.status(400).json({ success: false, error: 'Prénom, nom et équipe sont requis.' });
  }

  try {
    const player = await playerService.createPlayer({ firstName, lastName, teamId });
    return res.status(201).json({ success: true, data: player });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}
async function updatePlayer(req, res) {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ success: false, error: 'Prénom et nom sont requis.' });
  }
  try {
    const player = await playerService.updatePlayer(req.params.id, { firstName, lastName });
    return res.json({ success: true, data: player });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

async function togglePlayerActive(req, res) {
  const { active } = req.body;
  try {
    const player = await playerService.togglePlayerActive(req.params.id, active);
    return res.json({ success: true, data: player });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

module.exports = { getAllPlayers, getPlayersByTeam, createPlayer, updatePlayer, togglePlayerActive };