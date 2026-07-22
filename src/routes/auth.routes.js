const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.post('/login', authController.login);
router.post('/users', requireAuth, authController.createUser);
router.get('/coaches', requireAuth, authController.getAllCoachAccounts);
router.put('/users/:id', requireAuth, authController.updateUser);
router.patch('/users/:id/active', requireAuth, authController.toggleUserActive);

module.exports = router;