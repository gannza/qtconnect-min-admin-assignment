const { logger } = require('../utils/Logger');

/**
 * Server configuration and startup logic
 * Handles server initialization and graceful shutdown
 */
class ServerConfig {
  /**
   *
   * @param app
   * @param port
   * @param host
   */
  constructor(app, port, host) {
    this.app = app;
    this.port = port;
    this.host = host;
    this.server = null;
  }

  /**
   *
   */
  async start() {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.port, this.host, (error) => {
        if (error) {
          reject(error);
        } else {
          logger.info(`Server running on http://${this.host}:${this.port}`);
          resolve();
        }
      });

      this.setupGracefulShutdown();
    });
  }

  /**
   *
   */
  setupGracefulShutdown() {
    process.on('SIGTERM', () => this.gracefulShutdown());
    process.on('SIGINT', () => this.gracefulShutdown());
  }

  /**
   *
   */
  async gracefulShutdown() {
    logger.info('Received shutdown signal, closing server gracefully...');
   
    if (this.server) {
      return new Promise((resolve) => {
        this.server.close(() => {
          logger.info('Server closed');
          resolve();
        });
      });
    }
  }
}

module.exports = ServerConfig;
