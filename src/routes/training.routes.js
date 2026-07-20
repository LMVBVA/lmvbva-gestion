const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/training.controller');

router.get('/', trainingController.getAllTrainings);
router.get('/team/:teamId', trainingController.getTrainingsByTeam);
router.get('/:id', trainingController.getTrainingById);
router.post('/', trainingController.createTraining);

module.exports = router;