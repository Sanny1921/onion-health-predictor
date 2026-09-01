/**
 * WebSocket Predict Handler
 * Path: /ws/predict
 * Accepts binary JPEG frame buffers, processes them sequentially through PredictionService,
 * and sends normalized public prediction JSON back to the client.
 */

const { WebSocketServer } = require('ws');
const PredictionService = require('../services/predictionService');

/**
 * Attaches WebSocket server instance to an existing HTTP server on /ws/predict.
 * @param {import('http').Server} server - HTTP Server instance
 * @param {PredictionService} [customPredictionService]
 */
function setupWebSocketServer(server, customPredictionService = null) {
  const predictionService = customPredictionService || new PredictionService();
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    try {
      const { pathname } = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

      if (pathname === '/ws/predict') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      } else {
        socket.destroy();
      }
    } catch (err) {
      socket.destroy();
    }
  });

  wss.on('connection', (ws) => {
    // Flag to enforce sequential frame processing per client session
    let isProcessingFrame = false;

    ws.on('message', async (data, isBinary) => {
      // Prevent concurrent Gemini calls for the same WebSocket connection
      if (isProcessingFrame) {
        return;
      }

      isProcessingFrame = true;

      try {
        const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
        const result = await predictionService.processImageBuffer(buffer);

        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify(result));
        }
      } catch (err) {
        if (ws.readyState === ws.OPEN) {
          ws.send(
            JSON.stringify({
              success: false,
              detail: err.message || 'Frame processing error.',
            })
          );
        }
      } finally {
        isProcessingFrame = false;
      }
    });

    ws.on('close', () => {
      isProcessingFrame = false;
    });

    ws.on('error', () => {
      isProcessingFrame = false;
    });
  });

  return wss;
}

module.exports = {
  setupWebSocketServer,
};
