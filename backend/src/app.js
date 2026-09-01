/**
 * Express Application Configuration
 */

const express = require('express');
const cors = require('cors');

const healthRouter = require('./routes/health');
const predictRouter = require('./routes/predict');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(healthRouter);
app.use(predictRouter);

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    detail: `Endpoint not found: ${req.method} ${req.url}`,
  });
});

// Global 500 error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    detail: 'An internal server error occurred.',
  });
});

module.exports = app;
