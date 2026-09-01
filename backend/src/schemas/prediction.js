/**
 * Prediction Output Schema & Validator
 * Defines the Gemini Structured Output JSON Schema and runtime validation logic.
 */

// Allowed prediction classification enum values
const ALLOWED_PREDICTIONS = ['healthy', 'unhealthy', 'unassessable'];

/**
 * Gemini SDK Response JSON Schema definition
 * Uses standard JSON Schema syntax compatible with @google/genai SDK structured output
 */
const geminiResponseSchema = {
  type: 'object',
  properties: {
    prediction: {
      type: 'string',
      enum: ALLOWED_PREDICTIONS,
      description: 'Classification of onion visual quality: healthy, unhealthy, or unassessable',
    },
    confidence: {
      type: 'number',
      description: 'AI assessment confidence score between 0.0 and 100.0',
    },
    condition: {
      type: 'string',
      description: 'Summary description of the observed condition of the onion(s)',
    },
    observations: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'List of specific visual observations supporting the assessment',
    },
    recommendation: {
      type: 'string',
      description: 'Actionable guidance based on the visual assessment',
    },
  },
  required: ['prediction', 'confidence', 'condition', 'observations', 'recommendation'],
};

/**
 * Strict Runtime Validation and Normalization
 * Ensures data returned by Gemini or mock service conforms strictly to the expected backend contract.
 * @param {any} data - Raw parsed output
 * @returns {{ prediction: string, confidence: number, condition: string, observations: string[], recommendation: string }}
 * @throws {Error} - Throws descriptive Error if validation fails.
 */
function validateAndNormalizePrediction(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Malformed AI response: Response is not a valid JSON object.');
  }

  // 1. Validate prediction enum
  const prediction = (data.prediction || '').toString().toLowerCase().trim();
  if (!ALLOWED_PREDICTIONS.includes(prediction)) {
    throw new Error(
      `Invalid AI response: 'prediction' must be one of [${ALLOWED_PREDICTIONS.join(', ')}], got '${data.prediction}'`
    );
  }

  // 2. Validate confidence range
  let confidence = Number(data.confidence);
  // Convert 0.0 - 1.0 float scale to 0 - 100 percentage scale if returned as decimal
  if (confidence > 0 && confidence <= 1.0) {
    confidence = confidence * 100;
  }
  if (isNaN(confidence) || confidence < 0 || confidence > 100) {
    throw new Error(
      `Invalid AI response: 'confidence' must be a numeric score between 0 and 100, got '${data.confidence}'`
    );
  }
  // Round to 2 decimal places
  confidence = Math.round(confidence * 100) / 100;

  // 3. Validate condition
  const condition = (data.condition || 'Condition assessed').toString().trim();

  // 4. Validate observations
  let observations = [];
  if (Array.isArray(data.observations)) {
    observations = data.observations.map((item) => item.toString().trim()).filter((str) => str.length > 0);
  }

  // 5. Validate recommendation
  const recommendation = (data.recommendation || 'No recommendation provided.').toString().trim();

  return {
    prediction,
    confidence,
    condition,
    observations,
    recommendation,
  };
}

module.exports = {
  geminiResponseSchema,
  validateAndNormalizePrediction,
  ALLOWED_PREDICTIONS,
};
