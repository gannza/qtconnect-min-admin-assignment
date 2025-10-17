const { logger } = require('../utils/Logger');

/**
 * Global error handler middleware
 * Following SOLID principles for error handling
 */
class ErrorHandler {
    /**
     * Handle errors
     * @param {Error} err - Error object
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next function
     */

  static handle(err, req, res, next) {
    // Log the error
    logger.error('Error occurred', err);

    // Determine error type and severity
    const errorInfo = this.categorizeError(err);
    
    // Prepare error response
    const errorResponse = this.prepareErrorResponse(err, errorInfo);

    // Send error response using the response object
    res.status(errorInfo.statusCode).json(errorResponse);
  }

  /**
   * Categorize error and determine appropriate response
   * @param {Error} err - Error object
   * @returns {Object} Error information
   */
  
  static categorizeError(err) {
    // Validation errors
    if (err.name === 'ValidationError' || err.type === 'validation') {
      return {
        type: 'validation_error',
        severity: 'low',
        statusCode: 400,
        userMessage: 'Validation failed'
      };
    }

    // Database errors
    if (err.code && err.code.startsWith('SQLITE_')) {
      return {
        type: 'database_error',
        severity: 'high',
        statusCode: 500,
        userMessage: 'Database operation failed'
      };
    }

    // Duplicate key errors
    if (err.code === 'ER_DUP_ENTRY' || err.message.includes('UNIQUE constraint failed')) {
      return {
        type: 'duplicate_key_error',
        severity: 'low',
        statusCode: 409,
        userMessage: 'Resource already exists'
      };
    }

    // Not found errors
    if (err.name === 'NotFoundError' || err.status === 404) {
      return {
        type: 'not_found_error',
        severity: 'low',
        statusCode: 404,
        userMessage: 'Resource not found'
      };
    }

    // Unauthorized errors
    if (err.name === 'UnauthorizedError' || err.status === 401) {
      return {
        type: 'unauthorized_error',
        severity: 'medium',
        statusCode: 401,
        userMessage: 'Unauthorized access'
      };
    }

    // Forbidden errors
    if (err.name === 'ForbiddenError' || err.status === 403) {
      return {
        type: 'forbidden_error',
        severity: 'medium',
        statusCode: 403,
        userMessage: 'Access forbidden'
      };
    }

    // Rate limiting errors
    if (err.status === 429) {
      return {
        type: 'rate_limit_error',
        severity: 'medium',
        statusCode: 429,
        userMessage: 'Too many requests'
      };
    }

    // Default to internal server error
    return {
      type: 'internal_server_error',
      severity: 'high',
      statusCode: 500,
      userMessage: 'Internal server error'
    };
  }

  /**
   * Prepare error response based on environment and error type
   * @param {Error} err - Error object
   * @param {Object} errorInfo - Error categorization info
   * @returns {Object} Error response object
   */
  static prepareErrorResponse(err, errorInfo) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const response = {
      error: {
        message: errorInfo.userMessage,
        type: errorInfo.type,
        timestamp: new Date().toISOString()
      }
    };

    // Include additional details in development
    if (isDevelopment) {
      response.error.details = {
        originalMessage: err.message,
        stack: err.stack,
        ...err
      };
    }

    // Include validation errors if available
    if (err.validationResult && !err.validationResult.isValid) {
      response.error.validation = err.validationResult.toJSON();
    }

    // Include request information for debugging
    if (isDevelopment && err.requestInfo) {
      response.error.request = err.requestInfo;
    }

    return response;
  }

  /**
   * Handle async errors by wrapping async route handlers
   * @param {Function} fn - Async function to wrap
   * @returns {Function} Wrapped function
   */
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  /**
   * Create a custom error with additional context
   * @param {string} message - Error message
   * @param {Object} options - Error options
   * @returns {Error} Custom error
   */
  static createError(message, options = {}) {
    const error = new Error(message);
    error.name = options.name || 'CustomError';
    error.status = options.status || 500;
    error.type = options.type || 'custom_error';
    error.validationResult = options.validationResult;
    error.requestInfo = options.requestInfo;
    
    return error;
  }

  /**
   * Handle 404 errors
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static handleNotFound(req, res) {
    const error = this.createError('Route not found', {
      name: 'NotFoundError',
      status: 404,
      type: 'not_found_error',
      requestInfo: {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    this.handle(error, req, res);
  }
}

module.exports = {
  errorHandler: ErrorHandler.handle,
  asyncHandler: ErrorHandler.asyncHandler,
  createError: ErrorHandler.createError,
  handleNotFound: ErrorHandler.handleNotFound
};