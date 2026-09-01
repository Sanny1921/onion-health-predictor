/**
 * Prediction Router
 * Endpoint: POST /api/predict
 */

const express = require('express');
const multer = require('multer');
const PredictionController = require('../controllers/predictionController');
const { MAX_IMAGE_SIZE_BYTES } = require('../utils/imageValidation');

const router = express.Router();

// Configure Multer for in-memory upload handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
  },
});

const predictionController = new PredictionController();

/**
 * POST /api/predict
 * Accepts multipart/form-data with image file field ('file', 'image', 'photo', etc.)
 */
router.post('/api/predict', upload.any(), predictionController.predictPhoto);

module.exports = router;
