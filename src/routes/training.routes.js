const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/training.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.get('/', requireAuth, trainingController.getAllTrainings);
router.get('/team/:teamId', requireAuth, trainingController.getTrainingsByTeam);
router.get('/:id', requireAuth, trainingController.getTrainingById);
router.post('/', requireAuth, trainingController.createTraining);
router.post('/generate/:teamId', requireAuth, trainingController.generateTrainings);

module.exports = router;