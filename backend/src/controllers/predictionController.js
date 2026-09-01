/**
 * Prediction Controller
 * Express controller handling image prediction requests and error formatting.
 */

const PredictionService = require('../services/predictionService');

class PredictionController {
  /**
   * @param {PredictionService} [predictionService]
   */
  constructor(predictionService = null) {
    this.predictionService = predictionService || new PredictionService();
  }

  /**
   * HTTP POST /api/predict handler
   */
  predictPhoto = async (req, res) => {
    try {
      const files = req.files || [];
      const uploadedFile = files.length > 0 ? files[0] : req.file;

      if (!uploadedFile || !uploadedFile.buffer) {
        return res.status(400).json({
          success: false,
          detail: 'No image file uploaded. Send multipart/form-data with an image file under field "file" or "image".',
        });
      }

      const response = await this.predictionService.processImageBuffer(uploadedFile.buffer);
      return res.status(200).json(response);
    } catch (err) {
      // Determine HTTP status code from error properties
      let statusCode = 400;
      if (err.statusCode && err.statusCode >= 400 && err.statusCode < 600) {
        statusCode = err.statusCode;
      } else if (err.message && err.message.includes('Invalid image payload')) {
        statusCode = 400;
      } else if (err.message && err.message.includes('Invalid or corrupted image format')) {
        statusCode = 400;
      }

      return res.status(statusCode).json({
        success: false,
        detail: err.message || 'AI prediction processing failed.',
      });
    }
  };
}

module.exports = PredictionController;
