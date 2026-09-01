const http = require('http');
const WebSocket = require('ws');
const app = require('../src/app');
const { setupWebSocketServer } = require('../src/websocket/predictHandler');

describe('WebSocket /ws/predict', () => {
  let server;
  let port;
  let wsUrl;

  beforeAll((done) => {
    server = http.createServer(app);
    setupWebSocketServer(server);
    server.listen(0, '127.0.0.1', () => {
      port = server.address().port;
      wsUrl = `ws://127.0.0.1:${port}/ws/predict`;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should accept binary JPEG frames and return prediction JSON', (done) => {
    const ws = new WebSocket(wsUrl);
    const validFrame = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01
    ]);

    ws.on('open', () => {
      ws.send(validFrame);
    });

    ws.on('message', (message) => {
      const data = JSON.parse(message.toString());
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('prediction', 'healthy');
      expect(data).toHaveProperty('confidence', 99.8);
      ws.close();
      done();
    });
  });

  it('should return error response for invalid binary frame data', (done) => {
    const ws = new WebSocket(wsUrl);
    const invalidFrame = Buffer.from('INVALID_FRAME_DATA');

    ws.on('open', () => {
      ws.send(invalidFrame);
    });

    ws.on('message', (message) => {
      const data = JSON.parse(message.toString());
      expect(data).toHaveProperty('success', false);
      expect(data).toHaveProperty('detail');
      expect(data.detail).toMatch(/Invalid or corrupted image format/i);
      ws.close();
      done();
    });
  });
});
