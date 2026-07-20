const trainingService = require('../services/training.service');

async function getAllTrainings(req, res) {
  try {
    const trainings = await trainingService.getAllTrainings();
    return res.json({ success: true, data: trainings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

async function getTrainingsByTeam(req, res) {
  try {
    const trainings = await trainingService.getTrainingsByTeam(req.params.teamId);
    return res.json({ success: true, data: trainings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

async function getTrainingById(req, res) {
  try {
    const training = await trainingService.getTrainingById(req.params.id);
    if (!training) {
      return res.status(404).json({ success: false, error: 'Entraînement introuvable.' });
    }
    return res.json({ success: true, data: training });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

async function createTraining(req, res) {
  const { date, teamId } = req.body;

  if (!date || !teamId) {
    return res.status(400).json({ success: false, error: 'Date et équipe sont requis.' });
  }

  try {
    const training = await trainingService.createTraining({ date, teamId });
    return res.status(201).json({ success: true, data: training });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

module.exports = { getAllTrainings, getTrainingsByTeam, getTrainingById, createTraining };