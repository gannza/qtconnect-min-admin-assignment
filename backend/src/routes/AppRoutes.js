
/**
 * Application routes configuration
 */

/**
 *
 */
class AppRoutes {
  /**
   * Setup application routes
   * @param {object} app - Express application
   */
  static setup(app) {
    /**
     * Root route
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     */   

    // Root route
    app.get('/', (req, res) => {
      res.json({
        message: 'QtConnect Admin Backend API',
        version: '1.0.0',
        status: 'running'
      });
    });
  }
}

module.exports = {
  appRoutes: AppRoutes.setup
};
