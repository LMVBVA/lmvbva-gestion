const express = require('express');
const cors = require('cors');
require('dotenv').config();
const teamRoutes = require('./src/routes/team.routes');

const authRoutes = require('./src/routes/auth.routes');
const playerRoutes = require('./src/routes/player.routes');
const trainingRoutes = require('./src/routes/training.routes');
const attendanceRoutes = require('./src/routes/attendance.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/auth', authRoutes);
app.use('/teams', teamRoutes);
app.use('/players', playerRoutes);
app.use('/trainings', trainingRoutes);
app.use('/attendance', attendanceRoutes);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API LMVBVA en ligne' });
});

module.exports = app;