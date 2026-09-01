const { MockGeminiService } = require('../src/services/geminiService');

describe('MockGeminiService', () => {
  let adapter;

  beforeEach(() => {
    adapter = new MockGeminiService();
  });

  it('should return healthy prediction for even length buffer', async () => {
    const evenBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0]); // length 4
    const result = await adapter.analyzeImage(evenBuffer, 'image/jpeg');

    expect(result).toHaveProperty('prediction', 'healthy');
    expect(result).toHaveProperty('confidence', 96.5);
  });

  it('should return unassessable prediction for buffer length multiple of 5', async () => {
    const multipleOf5Buffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00]); // length 5
    const result = await adapter.analyzeImage(multipleOf5Buffer, 'image/jpeg');

    expect(result).toHaveProperty('prediction', 'unassessable');
    expect(result).toHaveProperty('confidence', 0);
  });

  it('should return unhealthy prediction for odd non-multiple of 5 buffer', async () => {
    const oddBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x01, 0x02]); // length 7
    const result = await adapter.analyzeImage(oddBuffer, 'image/jpeg');

    expect(result).toHaveProperty('prediction', 'unhealthy');
    expect(result).toHaveProperty('confidence', 98.42);
  });
});
