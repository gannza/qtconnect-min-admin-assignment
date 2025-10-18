const { logger } = require('../utils/Logger');

/**
 * Database configuration and initialization
 * Handles database setup and connection
 */
class DatabaseConfig {
  

  /**
   *
   */
  static async initialize() {
    try {
      const { database } = require('../database/Database');
      await database.initialize();
      logger.info('Database initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize database:', error);
      throw error;
    }
  }
}

module.exports = DatabaseConfig;
