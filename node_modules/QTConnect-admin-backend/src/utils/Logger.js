const winston = require('winston');

/**
 * Winston logger configuration 
 */
class Logger {
  constructor() {
    this.logger = this.createLogger();
  }

  createLogger() {
    const logFormat = winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        
        if (stack) {
          logMessage += `\n${stack}`;
        }
        
        if (Object.keys(meta).length > 0) {
          logMessage += `\n${JSON.stringify(meta, null, 2)}`;
        }
        
        return logMessage;
      })
    );

    const transports = [
      // Console transport for development
      new winston.transports.Console({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }),

      // File transport for errors
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5
      }),

      // File transport for all logs
      new winston.transports.File({
        filename: 'logs/log.log',
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5
      })
    ];

    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      transports,
      exitOnError: false
    });
  }

  /**
   * Log an info message
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  info(message, meta = {}) {
    this.logger.info(message, meta);
  }

  /**
   * Log a warning message
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  warn(message, meta = {}) {
    this.logger.warn(message, meta);
  }

  /**
   * Log an error message
   * @param {string} message - Log message
   * @param {Error|Object} error - Error object or metadata
   */
  error(message, error = {}) {
    if (error instanceof Error) {
      this.logger.error(message, {
        error: error.message,
        stack: error.stack,
        ...error
      });
    } else {
      this.logger.error(message, error);
    }
  }

  /**
   * Log a debug message
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  debug(message, meta = {}) {
    this.logger.debug(message, meta);
  }

  /**
   * Log HTTP request details
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {number} responseTime - Response time in milliseconds
   */
  logHttpRequest(req, res, responseTime) {
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      contentLength: res.get('Content-Length')
    };

    if (res.statusCode >= 400) {
      this.error('HTTP Request Error', logData);
    } else {
      this.info('HTTP Request', logData);
    }
  }

  /**
   * Log database operation
   * @param {string} operation - Database operation type
   * @param {string} table - Table name
   * @param {Object} data - Operation data
   * @param {number} duration - Operation duration in milliseconds
   */
  logDatabaseOperation(operation, table, data = {}, duration = null) {
    const logData = {
      operation,
      table,
      duration: duration ? `${duration}ms` : null,
      ...data
    };

    this.debug('Database Operation', logData);
  }

  /**
   * Log validation error
   * @param {string} entity - Entity being validated
   * @param {Object} validationResult - Validation result
   * @param {Object} data - Data that failed validation
   */
  logValidationError(entity, validationResult, data = {}) {
    this.warn(`Validation failed for ${entity}`, {
      entity,
      validationResult: validationResult.toJSON(),
      data: this.sanitizeData(data)
    });
  }

  /**
   * Log security event
   * @param {string} event - Security event type
   * @param {Object} details - Event details
   */
  logSecurityEvent(event, details = {}) {
    this.warn(`Security Event: ${event}`, {
      event,
      timestamp: new Date().toISOString(),
      ...details
    });
  }

  /**
   * Sanitize sensitive data before logging
   * @param {Object} data - Data to sanitize
   * @returns {Object} Sanitized data
   */
  sanitizeData(data) {
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'signature'];
    const sanitized = { ...data };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Get the underlying Winston logger instance
   * @returns {winston.Logger}
   */
  getLogger() {
    return this.logger;
  }
}

module.exports = {
  logger: new Logger()
};
