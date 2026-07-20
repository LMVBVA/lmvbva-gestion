const attendanceService = require('../services/attendance.service');

async function recordBulkAttendance(req, res) {
  const { trainingId, attendances } = req.body;
  const recordedByUserId = req.body.recordedByUserId;

  if (!trainingId || !Array.isArray(attendances) || attendances.length === 0) {
    return res.status(400).json({ success: false, error: 'trainingId et une liste de présences sont requis.' });
  }

  if (!recordedByUserId) {
    return res.status(400).json({ success: false, error: 'recordedByUserId est requis.' });
  }

  try {
    const result = await attendanceService.recordBulkAttendance(trainingId, attendances, recordedByUserId);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

async function getAttendanceByTraining(req, res) {
  try {
    const attendances = await attendanceService.getAttendanceByTraining(req.params.trainingId);
    return res.json({ success: true, data: attendances });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

async function getAttendanceByPlayer(req, res) {
  try {
    const attendances = await attendanceService.getAttendanceByPlayer(req.params.playerId);
    return res.json({ success: true, data: attendances });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}

module.exports = { recordBulkAttendance, getAttendanceByTraining, getAttendanceByPlayer };