/**
 * Prediction Service
 * Core business logic service decoupling API endpoints from model execution.
 */

const { validateImageBuffer } = require('../utils/imageValidation');
const { MockModelAdapter } = require('./modelAdapter');

class PredictionService {
  /**
   * @param {import('./modelAdapter').BaseModelAdapter} [modelAdapter]
   */
  constructor(modelAdapter = null) {
    this.modelAdapter = modelAdapter || new MockModelAdapter();
  }

  /**
   * Validates raw image buffer and invokes the configured model adapter.
   * @param {Buffer} buffer - Binary JPEG/PNG payload
   * @returns {Promise<{ success: boolean, prediction: string, confidence: number }>}
   */
  async processImageBuffer(buffer) {
    // 1. Validate image format and buffer integrity
    validateImageBuffer(buffer);

    // 2. Execute inference through model adapter boundary
    const result = await this.modelAdapter.predict(buffer);

    // 3. Return standardized API contract response
    return {
      success: true,
      prediction: result.prediction,
      confidence: result.confidence,
    };
  }
}

module.exports = PredictionService;
