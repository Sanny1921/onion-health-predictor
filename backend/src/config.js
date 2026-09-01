/**
 * Central Environment Configuration
 * Loads environment variables and enforces strict configuration rules.
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

function getConfig() {
  return {
    PORT: parseInt(process.env.PORT || '8000', 10),
    HOST: process.env.HOST || '0.0.0.0',
    GEMINI_API_KEY: (process.env.GEMINI_API_KEY || '').trim(),
    GEMINI_MODEL: (process.env.GEMINI_MODEL || 'gemini-3.5-flash').trim(),
    USE_MOCK_GEMINI: (process.env.USE_MOCK_GEMINI || 'false').toLowerCase() === 'true',
    GEMINI_TIMEOUT_MS: parseInt(process.env.GEMINI_TIMEOUT_MS || '10000', 10),
  };
}

const config = getConfig();

/**
 * Validates active configuration rules.
 * Throws error if USE_MOCK_GEMINI=false and GEMINI_API_KEY is missing.
 * @param {object} [customConfig]
 */
function validateConfig(customConfig = null) {
  const cfg = customConfig || getConfig();
  if (!cfg.USE_MOCK_GEMINI && !cfg.GEMINI_API_KEY) {
    throw new Error(
      'Configuration Error: USE_MOCK_GEMINI is set to false but GEMINI_API_KEY is missing. ' +
        'Set a valid GEMINI_API_KEY in environment variables or set USE_MOCK_GEMINI=true for development/testing.'
    );
  }
}

module.exports = {
  config,
  getConfig,
  validateConfig,
};
