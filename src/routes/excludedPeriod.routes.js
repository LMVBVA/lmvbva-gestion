const express = require('express');
const router = express.Router();
const excludedPeriodController = require('../controllers/excludedPeriod.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.get('/', requireAuth, excludedPeriodController.getAllExcludedPeriods);
router.post('/', requireAuth, excludedPeriodController.createExcludedPeriod);
router.delete('/:id', requireAuth, excludedPeriodController.deleteExcludedPeriod);

module.exports = router;