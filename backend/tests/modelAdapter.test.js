const { MockModelAdapter } = require('../src/services/modelAdapter');

describe('MockModelAdapter', () => {
  let adapter;

  beforeEach(() => {
    adapter = new MockModelAdapter();
  });

  it('should return healthy for even length buffer', async () => {
    const evenBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0]); // length 4
    const result = await adapter.predict(evenBuffer);

    expect(result).toHaveProperty('prediction', 'healthy');
    expect(result).toHaveProperty('confidence', 99.8);
  });

  it('should return unhealthy for odd length buffer', async () => {
    const oddBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00]); // length 5
    const result = await adapter.predict(oddBuffer);

    expect(result).toHaveProperty('prediction', 'unhealthy');
    expect(result).toHaveProperty('confidence', 98.42);
  });
});
