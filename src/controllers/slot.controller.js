const slotService = require('../services/slot.service');

async function getSlotsByTeam(req, res) {
  try {
    const slots = await slotService.getSlotsByTeam(req.params.teamId);
    return res.json({ success: true, data: slots });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

async function createSlot(req, res) {
  const { teamId, dayOfWeek, startTime, endTime } = req.body;

  if (!teamId || dayOfWeek === undefined || !startTime || !endTime) {
    return res.status(400).json({ success: false, error: 'Tous les champs sont requis.' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'Réservé aux administrateurs.' });
  }

  try {
    const slot = await slotService.createSlot({ teamId, dayOfWeek, startTime, endTime });
    return res.status(201).json({ success: true, data: slot });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

async function deleteSlot(req, res) {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'Réservé aux administrateurs.' });
  }
  try {
    await slotService.deleteSlot(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

module.exports = { getSlotsByTeam, createSlot, deleteSlot };