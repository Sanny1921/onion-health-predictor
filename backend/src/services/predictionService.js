/**
 * Prediction Service
 * Core business service coordinating image validation and Gemini AI inference.
 */

const { validateImageBuffer } = require('../utils/imageValidation');
const { getGeminiService } = require('./geminiService');

class PredictionService {
  /**
   * @param {import('./geminiService').BaseGeminiService} [geminiService]
   */
  constructor(geminiService = null) {
    this._customGeminiService = geminiService;
  }

  get geminiService() {
    if (!this._customGeminiService) {
      this._customGeminiService = getGeminiService();
    }
    return this._customGeminiService;
  }

  /**
   * Validates raw image buffer and invokes the configured Gemini service.
   * @param {Buffer} buffer - Binary JPEG/PNG payload
   * @returns {Promise<{ success: boolean, prediction: string, confidence: number, condition: string, observations: string[], recommendation: string }>}
   */
  async processImageBuffer(buffer) {
    // 1. Validate image format & determine server-verified MIME type from header magic numbers
    const mimeType = validateImageBuffer(buffer);

    // 2. Execute inference through Gemini service boundary
    const result = await this.geminiService.analyzeImage(buffer, mimeType);

    // 3. Return standardized public API contract response
    return {
      success: true,
      prediction: result.prediction,
      confidence: result.confidence,
      condition: result.condition,
      observations: result.observations,
      recommendation: result.recommendation,
    };
  }
}

module.exports = PredictionService;
