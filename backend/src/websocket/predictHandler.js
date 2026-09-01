/**
 * WebSocket Predict Handler
 * Path: /ws/predict
 * Receives binary JPEG frame buffers and returns JSON prediction objects.
 */

const { WebSocketServer } = require('ws');
const PredictionService = require('../services/predictionService');

const predictionService = new PredictionService();

/**
 * Attaches WebSocket server instance to an existing HTTP server listening on /ws/predict.
 * @param {import('http').Server} server - HTTP Server instance
 */
function setupWebSocketServer(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

    if (pathname === '/ws/predict') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws) => {
    ws.on('message', async (data, isBinary) => {
      try {
        const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
        const result = await predictionService.processImageBuffer(buffer);
        ws.send(JSON.stringify(result));
      } catch (err) {
        ws.send(
          JSON.stringify({
            success: false,
            detail: err.message || 'Frame inference error.',
          })
        );
      }
    });
  });

  return wss;
}

module.exports = {
  setupWebSocketServer,
};
