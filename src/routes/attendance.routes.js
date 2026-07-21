const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.post('/', requireAuth, attendanceController.recordBulkAttendance);
router.get('/training/:trainingId', requireAuth, attendanceController.getAttendanceByTraining);
router.get('/player/:playerId', requireAuth, attendanceController.getAttendanceByPlayer);

module.exports = router;