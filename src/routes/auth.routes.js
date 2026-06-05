const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/register', authController.registerUser);
router.post('/login', authController.LoginUser);
router.get('/me', verifyToken, authController.getProfile);
router.post('/logout', authController.logoutUser);

module.exports = router;