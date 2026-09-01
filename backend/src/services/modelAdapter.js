/**
 * Model Adapter Interface and Mock Implementation
 *
 * Provides a strict boundary between the Node.js API server and the ML inference engine.
 * The backend remains decoupled from ML code through this interface.
 */

/**
 * Base Model Adapter Class
 * Defines the contract that all model adapters must implement.
 */
class BaseModelAdapter {
  /**
   * Run inference on an image buffer.
   * @param {Buffer} buffer - Validated image buffer (JPEG/PNG)
   * @returns {Promise<{ prediction: string, confidence: number }>}
   */
  async predict(buffer) {
    throw new Error('BaseModelAdapter.predict() must be implemented by subclass.');
  }
}

/**
 * MockModelAdapter
 *
 * Used strictly for development and automated testing in environments without the ML model.
 * DOES NOT PERFORM REAL ML INFERENCE.
 */
class MockModelAdapter extends BaseModelAdapter {
  constructor() {
    super();
    console.warn('⚠️  [MockModelAdapter] Initialized. Using mock predictions for testing only.');
  }

  /**
   * Returns deterministic mock predictions based on buffer metrics for test predictability.
   * @param {Buffer} buffer - Validated image buffer
   * @returns {Promise<{ prediction: string, confidence: number }>}
   */
  async predict(buffer) {
    // Deterministic rule for testing:
    // If buffer length is even -> "healthy" (99.80)
    // If buffer length is odd -> "unhealthy" (98.42)
    const isEven = buffer.length % 2 === 0;

    if (isEven) {
      return {
        prediction: 'healthy',
        confidence: 99.8,
      };
    } else {
      return {
        prediction: 'unhealthy',
        confidence: 98.42,
      };
    }
  }
}

/*
 ==============================================================================
 GUIDANCE FOR ML DEVELOPER:
 ==============================================================================
 To connect a real ML model, create a new adapter class extending BaseModelAdapter.
 Example using ONNX Runtime for Node.js (onnxruntime-node):

 const ort = require('onnxruntime-node');

 class YOLOModelAdapter extends BaseModelAdapter {
   constructor(modelPath = 'best.onnx') {
     super();
     this.sessionPromise = ort.InferenceSession.create(modelPath);
   }

   async predict(buffer) {
     const session = await this.sessionPromise;
     // 1. Preprocess buffer to tensor (resize, normalize to CHW float32)
     // 2. Run session.run({ input: tensor })
     // 3. Postprocess outputs to extract top-1 label and confidence score
     return {
       prediction: 'healthy', // or 'unhealthy'
       confidence: 99.5
     };
   }
 }

 module.exports = { BaseModelAdapter, MockModelAdapter, YOLOModelAdapter };
 ==============================================================================
*/

module.exports = {
  BaseModelAdapter,
  MockModelAdapter,
};
