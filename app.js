const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API LMVBVA en ligne' });
});

module.exports = app;