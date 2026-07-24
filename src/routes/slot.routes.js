const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slot.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.get('/team/:teamId', requireAuth, slotController.getSlotsByTeam);
router.post('/', requireAuth, slotController.createSlot);
router.delete('/:id', requireAuth, slotController.deleteSlot);

module.exports = router;