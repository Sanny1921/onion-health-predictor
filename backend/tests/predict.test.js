const request = require('supertest');
const app = require('../src/app');

describe('POST /api/predict', () => {
  // Sample valid JPEG buffer (length 12 = even -> healthy)
  const validJpegEven = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01
  ]);

  // Sample valid JPEG buffer (length 13 = odd -> unhealthy)
  const validJpegOdd = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x00
  ]);

  it('should return prediction response for valid JPEG image (healthy)', async () => {
    const res = await request(app)
      .post('/api/predict')
      .attach('file', validJpegEven, 'onion.jpg');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      success: true,
      prediction: 'healthy',
      confidence: 99.8,
    });
  });

  it('should return prediction response for valid JPEG image (unhealthy)', async () => {
    const res = await request(app)
      .post('/api/predict')
      .attach('image', validJpegOdd, 'sample.jpeg');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      success: true,
      prediction: 'unhealthy',
      confidence: 98.42,
    });
  });

  it('should return 400 Bad Request when no file is uploaded', async () => {
    const res = await request(app).post('/api/predict');
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toEqual(false);
    expect(res.body.detail).toMatch(/No image file uploaded/i);
  });

  it('should return 400 Bad Request for corrupted/invalid file format', async () => {
    const invalidBuffer = Buffer.from('NOT_AN_IMAGE_FILE_DATA');

    const res = await request(app)
      .post('/api/predict')
      .attach('file', invalidBuffer, 'text.txt');

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toEqual(false);
    expect(res.body.detail).toMatch(/Invalid or corrupted image format/i);
  });
});
