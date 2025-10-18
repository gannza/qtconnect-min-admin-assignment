const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const { logger } = require('../utils/Logger');

/**
 * Basic middleware configuration
 * Handles core Express middleware setup
 */
class BasicMiddleware {
  /**
   * Setup basic middleware
   * @param {object} app - Express application
   */

  /**
   *
   * @param app
   */
  static setup(app) {
    // Compression middleware
    app.use(compression());
    
    // CORS middleware
    app.use(cors());
    
    // JSON parsing middleware

    app.use(require('express').json({ limit: '10mb' }));
    
    app.use(require('express').urlencoded({ extended: true }));
    
    // Request logging middleware
    app.use(morgan('combined', {
      stream: { /**
       *
       * @param message
       */
        write: message => logger.info(message.trim()) }
    }));
  }
}

module.exports = {
  basicMiddleware: BasicMiddleware.setup
};
