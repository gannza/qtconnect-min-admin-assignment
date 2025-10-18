const express = require('express');
const { database } = require('../database/Database');
const { logger } = require('../utils/Logger');

/**
 * Health check routes
 */
const router = express.Router();

/**
 * Basic health check
 */
router.get('/', async(req, res) => {
  try {
    const knex = database.getKnex();
    await knex.raw('SELECT 1');

    const memUsage = process.memoryUsage();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.version,
      environment: process.env.NODE_ENV || 'development',

      database: {
        status: 'connected',
        type: 'sqlite3'
      },
      memory: {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
      }
    });
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }

});

module.exports = router;
