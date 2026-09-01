process.env.USE_MOCK_GEMINI = 'true';
const request = require('supertest');
const app = require('../src/app');

describe('POST /api/predict', () => {
  // Valid JPEG header magic numbers (0xFF 0xD8 0xFF 0xE0...)
  // Even length (12 bytes) -> Mock returns healthy
  const validJpegEven = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
  ]);

  // Valid JPEG header (13 bytes = odd) -> Mock returns unhealthy
  const validJpegOdd = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x00,
  ]);

  // Valid PNG header (15 bytes = length % 5 === 0) -> Mock returns unassessable
  const validPng5Multiple = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44,
  ]);

  // Valid WEBP header (RIFF....WEBP) - Even length (14 bytes) -> Mock returns healthy
  const validWebpEven = Buffer.from([
    0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x00, 0x00,
  ]);

  it('should return healthy prediction response for valid JPEG image', async () => {
    const res = await request(app)
      .post('/api/predict')
      .attach('file', validJpegEven, 'onion.jpg');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      success: true,
      prediction: 'healthy',
      confidence: 96.5,
      condition: 'Healthy onion (Mock Mode)',
      observations: ['No obvious signs of rot', 'Firm outer skin'],
      recommendation: 'Appears suitable for use',
    });
  });

  it('should return unhealthy prediction response for valid JPEG image showing spoilage', async () => {
    const res = await request(app)
      .post('/api/predict')
      .attach('image', validJpegOdd, 'spoiled.jpeg');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      success: true,
      prediction: 'unhealthy',
      confidence: 98.42,
      condition: 'Unhealthy onion - Spoilage detected (Mock Mode)',
      observations: ['Visible dark discoloration and soft area observed.'],
      recommendation: 'Do not use or store near healthy onions.',
    });
  });

  it('should return unassessable prediction response when image cannot be evaluated', async () => {
    const res = await request(app)
      .post('/api/predict')
      .attach('file', validPng5Multiple, 'blurry.png');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      success: true,
      prediction: 'unassessable',
      confidence: 0,
      condition: 'Unable to assess onion (Mock Mode)',
      observations: ['No clearly identifiable onion visible in mock buffer.'],
      recommendation: 'Please provide a clear image of an onion.',
    });
  });

  it('should return healthy prediction response for valid WEBP image buffer', async () => {
    const res = await request(app)
      .post('/api/predict')
      .attach('file', validWebpEven, 'onion.webp');

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.prediction).toEqual('healthy');
  });

  it('should return 400 Bad Request when no file is uploaded', async () => {
    const res = await request(app).post('/api/predict');
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toEqual(false);
    expect(res.body.detail).toMatch(/No image file uploaded/i);
  });

  it('should return 400 Bad Request for corrupt/non-image data', async () => {
    const invalidData = Buffer.from('NOT_AN_IMAGE_FILE');
    const res = await request(app)
      .post('/api/predict')
      .attach('file', invalidData, 'notes.txt');

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toEqual(false);
    expect(res.body.detail).toMatch(/Invalid or corrupted image format/i);
  });
});
