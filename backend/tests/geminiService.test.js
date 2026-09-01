const {
  GeminiService,
  MockGeminiService,
  getGeminiService,
} = require('../src/services/geminiService');
const { validateAndNormalizePrediction } = require('../src/schemas/prediction');

describe('Gemini Service Module', () => {
  const validJpeg = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
  ]);

  describe('MockGeminiService', () => {
    it('should return valid structured data for healthy onion', async () => {
      const mockService = new MockGeminiService();
      const res = await mockService.analyzeImage(validJpeg, 'image/jpeg');
      expect(res).toHaveProperty('prediction');
      expect(['healthy', 'unhealthy', 'unassessable']).toContain(res.prediction);
      expect(typeof res.confidence).toBe('number');
      expect(res.confidence).toBeGreaterThanOrEqual(0);
      expect(res.confidence).toBeLessThanOrEqual(100);
      expect(Array.isArray(res.observations)).toBe(true);
    });
  });

  describe('Service Factory & Configuration Validation', () => {
    it('should return MockGeminiService when USE_MOCK_GEMINI=true', () => {
      const service = getGeminiService({
        USE_MOCK_GEMINI: true,
        GEMINI_API_KEY: '',
      });
      expect(service).toBeInstanceOf(MockGeminiService);
    });

    it('should throw startup configuration error when USE_MOCK_GEMINI=false and GEMINI_API_KEY is missing', () => {
      expect(() => {
        getGeminiService({
          USE_MOCK_GEMINI: false,
          GEMINI_API_KEY: '',
        });
      }).toThrow(/USE_MOCK_GEMINI is set to false but GEMINI_API_KEY is missing/i);
    });

    it('should return GeminiService when USE_MOCK_GEMINI=false and GEMINI_API_KEY is provided', () => {
      const service = getGeminiService({
        USE_MOCK_GEMINI: false,
        GEMINI_API_KEY: 'test_api_key_12345',
        GEMINI_MODEL: 'gemini-2.5-flash',
        GEMINI_TIMEOUT_MS: 5000,
      });
      expect(service).toBeInstanceOf(GeminiService);
    });
  });

  describe('Schema Validation & Normalization', () => {
    it('should accept valid prediction enum values', () => {
      const data = {
        prediction: 'HEALTHY',
        confidence: 96.543,
        condition: 'Good',
        observations: ['Firm'],
        recommendation: 'Use',
      };
      const result = validateAndNormalizePrediction(data);
      expect(result.prediction).toEqual('healthy');
      expect(result.confidence).toEqual(96.54);
    });

    it('should throw error for invalid prediction enum', () => {
      const data = {
        prediction: 'rotten',
        confidence: 90,
        condition: 'Bad',
        observations: [],
        recommendation: 'Discard',
      };
      expect(() => validateAndNormalizePrediction(data)).toThrow(
        /'prediction' must be one of/i
      );
    });

    it('should throw error for invalid confidence out of bounds', () => {
      const data = {
        prediction: 'healthy',
        confidence: 150,
        condition: 'Good',
        observations: [],
        recommendation: 'Use',
      };
      expect(() => validateAndNormalizePrediction(data)).toThrow(
        /'confidence' must be a numeric score between 0 and 100/i
      );
    });
  });

  describe('GeminiService SDK & Error Handling (Mocked API)', () => {
    let service;

    beforeEach(() => {
      service = new GeminiService({
        GEMINI_API_KEY: 'test_mock_key',
        GEMINI_MODEL: 'gemini-2.5-flash',
        GEMINI_TIMEOUT_MS: 500,
      });
    });

    it('should parse and return structured output from successful Gemini response', async () => {
      const mockSuccessJson = JSON.stringify({
        prediction: 'healthy',
        confidence: 95.5,
        condition: 'Healthy onion',
        observations: ['No rot visible'],
        recommendation: 'Suitable for consumption',
      });

      // Mock SDK generateContent method
      service.ai = {
        models: {
          generateContent: jest.fn().mockResolvedValue({
            text: mockSuccessJson,
          }),
        },
      };

      const result = await service.analyzeImage(validJpeg, 'image/jpeg');
      expect(result.prediction).toBe('healthy');
      expect(result.confidence).toBe(95.5);
      expect(result.observations).toEqual(['No rot visible']);
    });

    it('should handle malformed non-JSON Gemini response gracefully', async () => {
      service.ai = {
        models: {
          generateContent: jest.fn().mockResolvedValue({
            text: 'I cannot evaluate this image.',
          }),
        },
      };

      await expect(service.analyzeImage(validJpeg, 'image/jpeg')).rejects.toThrow(
        /Malformed AI response/i
      );
    });

    it('should handle Gemini API rate limit error (429)', async () => {
      const quotaErr = new Error('Quota exceeded for metric');
      quotaErr.status = 429;

      service.ai = {
        models: {
          generateContent: jest.fn().mockRejectedValue(quotaErr),
        },
      };

      await expect(service.analyzeImage(validJpeg, 'image/jpeg')).rejects.toThrow(
        /AI service rate limit exceeded/i
      );
    });

    it('should handle Gemini API authentication failure (401)', async () => {
      const authErr = new Error('API_KEY_INVALID');
      authErr.status = 401;

      service.ai = {
        models: {
          generateContent: jest.fn().mockRejectedValue(authErr),
        },
      };

      await expect(service.analyzeImage(validJpeg, 'image/jpeg')).rejects.toThrow(
        /AI service authentication failed/i
      );
    });

    it('should handle application-level timeout when Gemini hangs', async () => {
      // Mock SDK call that never resolves
      service.ai = {
        models: {
          generateContent: jest.fn().mockImplementation(() => new Promise(() => {})),
        },
      };

      await expect(service.analyzeImage(validJpeg, 'image/jpeg')).rejects.toThrow(
        /AI analysis timed out/i
      );
    });
  });
});
