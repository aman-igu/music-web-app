const express = require('express');
const router = express.Router();
const aiController = require('../Controllers/ai.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Chat endpoint (requires login so chatbot can personalise responses)
router.post('/chat', verifyToken, aiController.chatRecommendation);

module.exports = router;
