require('dotenv').config();
require('express-async-errors');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DB_FILENAME = ':memory:';

const Application = require('../core/Application');
const { logger } = require('../utils/Logger');

// Create test application
const app = new Application();

// Initialize the app for testing
app
  .initialize()
  .then(() => {
    // Export the Express app for supertest
    module.exports = app.getApp();
  })
  .catch((error) => {
    logger.error('Failed to initialize application', error);
    process.exit(1);
  });
