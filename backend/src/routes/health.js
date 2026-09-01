/**
 * Health Check Router
 * Endpoint: GET /health
 */

const express = require('express');
const { config } = require('../config');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    aiProvider: config.USE_MOCK_GEMINI ? 'mock' : 'gemini',
  });
});

module.exports = router;
