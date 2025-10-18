require('dotenv').config();
require('express-async-errors');

const Application = require('./core/Application');
const { logger } = require('./utils/Logger');

// Start application
const app = new Application();
app.initialize().catch(error => {
  logger.error('Application failed to start:', error);
  process.exit(1);
});

module.exports = app;
