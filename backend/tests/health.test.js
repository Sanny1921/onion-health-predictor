process.env.USE_MOCK_GEMINI = 'true';
const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  it('should return 200 OK with status healthy and non-sensitive aiProvider indicator', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('aiProvider');
    expect(res.body).not.toHaveProperty('GEMINI_API_KEY');
    expect(res.body).not.toHaveProperty('apiKey');
  });
});
