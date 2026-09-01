/**
 * Server Entrypoint
 * Binds Express app and WebSocket server to HTTP port 8000.
 */

const http = require('http');
const app = require('./app');
const { setupWebSocketServer } = require('./websocket/predictHandler');

const PORT = process.env.PORT || 8000;
const HOST = '0.0.0.0';

const server = http.createServer(app);

// Attach WebSocket server on /ws/predict
setupWebSocketServer(server);

server.listen(PORT, HOST, () => {
  console.log(`🚀 Node.js Onion Classifier Backend running at http://${HOST}:${PORT}`);
  console.log(`📡 WebSocket endpoint ready at ws://${HOST}:${PORT}/ws/predict`);
});

module.exports = server;
