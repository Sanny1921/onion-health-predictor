/**
 * Gemini Service Module
 * Handles communication with Google Gemini API using @google/genai SDK,
 * application-level timeout handling, structured output enforcement, and explicit mock service mode.
 */

const { GoogleGenAI } = require('@google/genai');
const { getConfig, validateConfig } = require('../config');
const { geminiResponseSchema, validateAndNormalizePrediction } = require('../schemas/prediction');

/**
 * System instruction defining the visual onion assessment guidelines for Gemini.
 */
const ONION_ASSESSMENT_SYSTEM_INSTRUCTION = `
You are an expert agricultural vision AI specializing in visual onion quality assessment.

Your task is to analyze the provided image of an onion (or onions) and return a structured JSON assessment.

ASSESSMENT RULES:
1. FIRST, DETERMINE IMAGE ASSESSABILITY:
   - Check if the image contains one or more clearly visible onions that can be reasonably evaluated.
   - If NO onion is visible, if the image shows an unrelated object, if the image is extremely blurry, too dark, overexposed, severely obstructed, if the scene contains too many onions to assess reliably, or if the onions are too small/partially hidden to assess reliably:
     Set "prediction" = "unassessable", "confidence" = 0, "condition" = "Unable to assess onion(s)", "observations" = ["No clearly identifiable onion visible, scene too crowded/obstructed, or image quality is insufficient."], "recommendation" = "Please provide a clear, well-lit photo of the onion(s)."

2. VISUAL CHARACTERISTICS TO EVALUATE:
   - Assess visible indicators such as: visible rot, mold-like growth, dark or unnatural discoloration, soft/sunken-looking areas, severe bruising, physical cut/wound damage, excessive shriveling, or sprouting.
   - Do NOT make claims about internal conditions that cannot be visually observed.
   - Do NOT claim laboratory-grade food safety.

3. MULTIPLE ONIONS BATCH ASSESSMENT:
   - If multiple onions are clearly visible in the image, assess the overall visible batch quality.
   - If ANY clearly visible onion shows significant visible spoilage or damage, classify the overall image as "unhealthy" and explain the relevant observation.
   - If the scene contains too many onions, is obstructed, or cannot be assessed reliably, return "unassessable".

4. PREDICTION CLASSIFICATION ENUM:
   - "prediction" MUST be strictly one of: "healthy", "unhealthy", or "unassessable".
   - "confidence" MUST be an AI assessment score from 0.0 to 100.0 (where 0 is completely unassessable and 100 is highly confident).

5. REQUIRED OUTPUT FIELDS:
   You must return JSON containing strictly:
   - "prediction": "healthy" | "unhealthy" | "unassessable"
   - "confidence": number (0-100)
   - "condition": string description
   - "observations": array of string observations
   - "recommendation": string recommendation
`;

/**
 * Base Service Interface
 */
class BaseGeminiService {
  /**
   * Analyzes an onion image buffer.
   * @param {Buffer} imageBuffer - Validated raw image buffer
   * @param {string} mimeType - Server-detected MIME type ('image/jpeg', 'image/png', or 'image/webp')
   * @returns {Promise<{ prediction: string, confidence: number, condition: string, observations: string[], recommendation: string }>}
   */
  async analyzeImage(imageBuffer, mimeType) {
    throw new Error('BaseGeminiService.analyzeImage() must be implemented by subclass.');
  }
}

/**
 * Real Gemini API Service Implementation
 */
class GeminiService extends BaseGeminiService {
  /**
   * @param {object} [customConfig]
   */
  constructor(customConfig = null) {
    super();
    const cfg = customConfig || getConfig();
    if (!cfg.USE_MOCK_GEMINI && !cfg.GEMINI_API_KEY) {
      validateConfig(cfg);
    }
    this.apiKey = cfg.GEMINI_API_KEY;
    this.modelName = cfg.GEMINI_MODEL || 'gemini-3.5-flash';
    this.timeoutMs = cfg.GEMINI_TIMEOUT_MS || 10000;

    // Initialize official Google Gen AI SDK client
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  /**
   * Sends image to Gemini API with multimodal prompt and structured JSON output.
   * @param {Buffer} imageBuffer
   * @param {string} mimeType
   */
  async analyzeImage(imageBuffer, mimeType = 'image/jpeg') {
    let timerId;

    try {
      const base64Data = imageBuffer.toString('base64');

      // Create API call Promise
      const apiPromise = this.ai.models.generateContent({
        model: this.modelName,
        contents: [
          ONION_ASSESSMENT_SYSTEM_INSTRUCTION,
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: geminiResponseSchema,
        },
      });

      // Prevent unhandled rejection if apiPromise rejects after application timeout
      apiPromise.catch(() => {});

      // Create application-level timeout Promise
      const timeoutPromise = new Promise((_, reject) => {
        timerId = setTimeout(() => {
          const timeoutErr = new Error(`AI analysis timed out after ${this.timeoutMs}ms.`);
          timeoutErr.code = 'GEMINI_TIMEOUT';
          timeoutErr.statusCode = 504;
          reject(timeoutErr);
        }, this.timeoutMs);
      });

      // Race API request against application timeout
      const response = await Promise.race([apiPromise, timeoutPromise]);
      clearTimeout(timerId);

      // Extract response text
      const rawText = response && response.text ? response.text : null;
      if (!rawText) {
        throw new Error('Empty response received from Gemini API.');
      }

      // Parse JSON output
      let parsedData;
      try {
        parsedData = JSON.parse(rawText);
      } catch (parseErr) {
        throw new Error(`Malformed AI response: Response text is not valid JSON. Content: "${rawText.substring(0, 100)}"`);
      }

      // Validate schema and normalize prediction
      return validateAndNormalizePrediction(parsedData);
    } catch (err) {
      if (timerId) clearTimeout(timerId);

      // Normalize network, auth, rate limit, and timeout errors
      if (err.code === 'GEMINI_TIMEOUT' || err.statusCode === 504) {
        const timeoutError = new Error('AI analysis timed out');
        timeoutError.statusCode = 504;
        throw timeoutError;
      }

      if (err.status === 401 || err.status === 403 || (err.message && err.message.includes('API_KEY'))) {
        console.error('Gemini Authentication Failure:', err.message);
        const authError = new Error('AI service authentication failed');
        authError.statusCode = 502;
        throw authError;
      }

      if (err.status === 429 || (err.message && err.message.includes('Quota'))) {
        const quotaError = new Error('AI service rate limit exceeded. Please try again later.');
        quotaError.statusCode = 429;
        throw quotaError;
      }

      // Preserve custom runtime validation messages if thrown by validateAndNormalizePrediction
      if (err.message && err.message.startsWith('Invalid AI response')) {
        const validationError = new Error(err.message);
        validationError.statusCode = 502;
        throw validationError;
      }

      console.error('Gemini API Service Error:', err);
      const generalError = new Error(err.message || 'AI service temporarily unavailable');
      generalError.statusCode = err.statusCode || 502;
      throw generalError;
    }
  }
}

/**
 * Explicit Mock Gemini Service for Keyless Development and Testing.
 * NEVER presented as real AI inference.
 */
class MockGeminiService extends BaseGeminiService {
  constructor() {
    super();
    console.warn(
      '⚠️  [MockGeminiService] Initialized explicitly (USE_MOCK_GEMINI=true). Using deterministic mock responses for testing.'
    );
  }

  /**
   * Returns deterministic mock predictions based on buffer metrics.
   * @param {Buffer} imageBuffer
   * @param {string} mimeType
   */
  async analyzeImage(imageBuffer, mimeType = 'image/jpeg') {
    const len = imageBuffer.length;

    if (len % 5 === 0) {
      return validateAndNormalizePrediction({
        prediction: 'unassessable',
        confidence: 0,
        condition: 'Unable to assess onion (Mock Mode)',
        observations: ['No clearly identifiable onion visible in mock buffer.'],
        recommendation: 'Please provide a clear image of an onion.',
      });
    }

    if (len % 2 === 0) {
      return validateAndNormalizePrediction({
        prediction: 'healthy',
        confidence: 96.5,
        condition: 'Healthy onion (Mock Mode)',
        observations: ['No obvious signs of rot', 'Firm outer skin'],
        recommendation: 'Appears suitable for use',
      });
    }

    return validateAndNormalizePrediction({
      prediction: 'unhealthy',
      confidence: 98.42,
      condition: 'Unhealthy onion - Spoilage detected (Mock Mode)',
      observations: ['Visible dark discoloration and soft area observed.'],
      recommendation: 'Do not use or store near healthy onions.',
    });
  }
}

/**
 * Service Factory
 * Returns GeminiService or MockGeminiService based on config.
 * Throws configuration error if USE_MOCK_GEMINI=false and GEMINI_API_KEY is missing.
 * @param {object} [customConfig]
 * @returns {BaseGeminiService}
 */
function getGeminiService(customConfig = null) {
  const cfg = customConfig || getConfig();

  if (cfg.USE_MOCK_GEMINI) {
    return new MockGeminiService();
  }

  // Enforce startup error rule if USE_MOCK_GEMINI=false and GEMINI_API_KEY is missing
  validateConfig(cfg);
  return new GeminiService(cfg);
}

module.exports = {
  BaseGeminiService,
  GeminiService,
  MockGeminiService,
  getGeminiService,
  ONION_ASSESSMENT_SYSTEM_INSTRUCTION,
};
