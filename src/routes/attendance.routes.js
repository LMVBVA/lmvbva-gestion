const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');

router.post('/', attendanceController.recordBulkAttendance);
router.get('/training/:trainingId', attendanceController.getAttendanceByTraining);
router.get('/player/:playerId', attendanceController.getAttendanceByPlayer);

module.exports = router;