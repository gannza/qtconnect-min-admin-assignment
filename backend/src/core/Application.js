const express = require('express');

// Middleware
const { errorHandler } = require('../middleware/ErrorHandler');
const { securityMiddleware } = require('../middleware/SecurityMiddleware');
const { basicMiddleware } = require('../middleware/BasicMiddleware');

// Utils
const { logger } = require('../utils/Logger');

// Config
const ServerConfig = require('../config/ServerConfig');
const DatabaseConfig = require('../config/DatabaseConfig');

// Routes
const { appRoutes } = require('../routes/AppRoutes');
const healthRoutes = require('../routes/HealthRoutes');
/**
 * Main Application class
 * Handles application initialization and configuration
 */
class Application {
  /**
   * Constructor for the Application class
   */
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 9090;
    this.host = process.env.HOST || 'localhost';
    this.serverConfig = null;
  }

  /**
   * Initialize the application
   */
  
  /**
   *
   */
  async initialize() {

    try {
      await this.setupDatabase();
      this.setupMiddleware();
      this.setupRoutes();
      this.setupErrorHandling();
      
      // Only start server if not in test mode
      if (process.env.NODE_ENV !== 'test') {
        await this.startServer();
      }
    } catch (error) {
      logger.error('Failed to initialize application:', error);
      process.exit(1);
    }
  }

  /**
   * Setup the database
   */
  async setupDatabase() {
    await DatabaseConfig.initialize();
  }

  /**
   * Setup the middleware
   */
  setupMiddleware() {
    basicMiddleware(this.app);
    securityMiddleware(this.app);
  }

  /**
   * Setup the routes
   */
  setupRoutes() {
    appRoutes(this.app);
    this.app.use('/health', healthRoutes);
  }

  /**
   * Setup the error handling
   */
  setupErrorHandling() {
    this.app.use(errorHandler);
  }

  /**
   * Start the server
   */
  async startServer() {
    this.serverConfig = new ServerConfig(this.app, this.port, this.host);
    await this.serverConfig.start();
  }

  /**
   * Get the Express app instance
   * @returns {express.Application}
   */
  getApp() {
    return this.app;
  }
}

module.exports = Application;
