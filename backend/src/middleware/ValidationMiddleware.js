const Joi = require('joi');
const { createError } = require('./ErrorHandler');

/**
 * Simple Joi-based validation middleware
 */

// Define schemas
const schemas = {
  userCreate: Joi.object({
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    role: Joi.string().valid('admin', 'user').default('user').messages({
      'any.only': 'Role must be either "admin" or "user"'
    }),
    status: Joi.string().valid('active', 'inactive').default('active').messages({
      'any.only': 'Status must be either "active" or "inactive"'
    })
  }),

  userUpdate: Joi.object({
    email: Joi.string().email().optional().messages({
      'string.email': 'Please provide a valid email address'
    }),
    role: Joi.string().valid('admin', 'user').optional().messages({
      'any.only': 'Role must be either "admin" or "user"'
    }),
    status: Joi.string().valid('active', 'inactive').optional().messages({
      'any.only': 'Status must be either "active" or "inactive"'
    })
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update'
  }), // At least one field required

  userId: Joi.object({
    id: Joi.string().pattern(/^\d+$/).required().messages({
      'string.pattern.base': 'ID must be a positive integer'
    })
  }),

  userQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    role: Joi.string().valid('admin', 'user').optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
    sortBy: Joi.string().valid('id', 'email', 'role', 'status', 'created_at', 'updated_at').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  })
};

/**
 * Generic validation middleware factory
 * @param {object} schema - Joi schema
 * @param {string} source - Data source ('body', 'params', 'query')
 * @returns {Function} Express middleware
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    
    // Check if request body is empty for POST/PUT requests
    if (source === 'body' && (req.method === 'POST' || req.method === 'PUT')) {
      if (!data || Object.keys(data).length === 0) {
        const validationError = createError('Request body is required', {
          status: 400,
          type: 'validation_error',
          message: 'Request body cannot be empty. Please provide the required data.',
          requestInfo: {
            operation: 'validation',
            source,
            data,
            endpoint: req.originalUrl,
            method: req.method
          }
        });
        return next(validationError);
      }
    }
    
    const { error, value } = schema.validate(data, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      console.log('Validation Error Details:', {
        source,
        data,
        errors: error.details,
        endpoint: req.originalUrl,
        method: req.method
      });
      const validationError = createError('Validation failed', {
        status: 400,
        type: 'validation_error',
        details: error.details,
        message: errorMessage,
        requestInfo: {
          operation: 'validation',
          source,
          data,
          endpoint: req.originalUrl,
          method: req.method
        }
      });
      return next(validationError);
    }

    // Replace the original data with validated and sanitized data
    req[source] = value;
    next();
  };
};

// Pre-configured middleware functions
const validateUserCreate = validate(schemas.userCreate, 'body');
const validateUserUpdate = validate(schemas.userUpdate, 'body');
const validateUserId = validate(schemas.userId, 'params');
const validateUserQuery = validate(schemas.userQuery, 'query');

module.exports = {
  validate,
  validateUserCreate,
  validateUserUpdate,
  validateUserId,
  validateUserQuery,
  schemas
};
