const express = require('express');
const UserController = require('../controllers/UserController');
const {
  validateUserCreate,
  validateUserUpdate,
  validateUserId,
  validateUserQuery
} = require('../middleware/JoiValidationMiddleware');

/**
 * Simple user routes using Joi validation middleware
 * Much cleaner and more maintainable than the complex ValidationMiddleware
 */
const router = express.Router();

// User CRUD routes with simple Joi validation
router.post('/', validateUserCreate, UserController.createUser);
router.get('/', validateUserQuery, UserController.getUsers);
router.get('/stats', UserController.getUserStats);
router.get('/chart', UserController.getUsersChartData);
router.get('/export', UserController.exportUsers);
router.get('/:id', validateUserId, UserController.getUserById);
router.put('/:id', validateUserId, validateUserUpdate, UserController.updateUser);
router.delete('/:id', validateUserId, UserController.deleteUser);

module.exports = router;
