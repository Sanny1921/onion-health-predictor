/**
 * Server Entrypoint
 * Binds Express app and WebSocket server to HTTP port 8000.
 */

const http = require('http');
const app = require('./app');
const { validateConfig, getConfig } = require('./config');
const { setupWebSocketServer } = require('./websocket/predictHandler');

// Validate active configuration on startup
try {
  validateConfig();
} catch (err) {
  console.error('❌ Server startup aborted due to configuration error:');
  console.error(err.message);
  process.exit(1);
}

const cfg = getConfig();
const PORT = cfg.PORT;
const HOST = cfg.HOST;

const server = http.createServer(app);

// Attach WebSocket server on /ws/predict
setupWebSocketServer(server);

server.listen(PORT, HOST, () => {
  console.log(`🚀 Node.js Onion Classifier Backend running at http://${HOST}:${PORT}`);
  console.log(`📡 WebSocket endpoint ready at ws://${HOST}:${PORT}/ws/predict`);
  console.log(`💡 Mode: ${cfg.USE_MOCK_GEMINI ? 'MOCK (Keyless Development)' : 'GEMINI REAL API'}`);
});

module.exports = server;
