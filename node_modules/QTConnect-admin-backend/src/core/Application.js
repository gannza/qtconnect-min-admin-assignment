const express = require('express');

// Middleware
const { errorHandler } = require('../middleware/ErrorHandler');
const { securityMiddleware } = require('../middleware/SecurityMiddleware');
const { basicMiddleware } = require('../middleware/BasicMiddleware');

// Utils
const { logger } = require('../utils/Logger');
const CryptoUtils = require('../utils/CryptoUtils');

// Config
const ServerConfig = require('../config/ServerConfig');
const DatabaseConfig = require('../config/DatabaseConfig');

// Routes
const { appRoutes } = require('../routes/AppRoutes');
const healthRoutes = require('../routes/HealthRoutes');
const userRoutes = require('../routes/UserRoutes');
const cryptoRoutes = require('../routes/CryptoRoutes');
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
  
  async initialize() {

    try {
      await this.setupDatabase();
      await this.setupCryptoUtils();
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
   * Setup cryptographic utilities
   */
  async setupCryptoUtils() {
    try {
      const cryptoUtils = new CryptoUtils();
      await cryptoUtils.initialize();
      logger.info('CryptoUtils initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize CryptoUtils:', error);
      throw error;
    }
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
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/crypto', cryptoRoutes);
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
   * @returns {express.Application} The Express application instance
   */
  getApp() {
    return this.app;
  }
}

module.exports = Application;
