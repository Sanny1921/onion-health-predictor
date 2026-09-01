/**
 * Prediction Router
 * Endpoint: POST /api/predict
 */

const express = require('express');
const multer = require('multer');
const PredictionService = require('../services/predictionService');

const router = express.Router();

// Memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max file size
  },
});

// Instantiated prediction service (uses MockModelAdapter)
const predictionService = new PredictionService();

/**
 * POST /api/predict
 * Accepts multipart/form-data with image file field ('file', 'image', 'photo', etc.)
 */
router.post('/api/predict', upload.any(), async (req, res) => {
  try {
    const files = req.files || [];
    const uploadedFile = files.length > 0 ? files[0] : req.file;

    if (!uploadedFile || !uploadedFile.buffer) {
      return res.status(400).json({
        success: false,
        detail: 'No image file uploaded. Send multipart/form-data with an image file.',
      });
    }

    const response = await predictionService.processImageBuffer(uploadedFile.buffer);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(400).json({
      success: false,
      detail: err.message || 'Image prediction failed.',
    });
  }
});

module.exports = router;
