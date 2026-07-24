const excludedPeriodService = require('../services/excludedPeriod.service');

async function getAllExcludedPeriods(req, res) {
  try {
    const periods = await excludedPeriodService.getAllExcludedPeriods();
    return res.json({ success: true, data: periods });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

async function createExcludedPeriod(req, res) {
  const { label, startDate, endDate, youthOnly } = req.body;

  if (!label || !startDate || !endDate) {
    return res.status(400).json({ success: false, error: 'Libellé, date de début et de fin sont requis.' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'Réservé aux administrateurs.' });
  }

  try {
    const period = await excludedPeriodService.createExcludedPeriod({ label, startDate, endDate, youthOnly });
    return res.status(201).json({ success: true, data: period });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

async function deleteExcludedPeriod(req, res) {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'Réservé aux administrateurs.' });
  }
  try {
    await excludedPeriodService.deleteExcludedPeriod(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

module.exports = { getAllExcludedPeriods, createExcludedPeriod, deleteExcludedPeriod };