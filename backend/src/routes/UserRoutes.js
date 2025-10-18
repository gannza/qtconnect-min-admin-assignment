const express = require('express');
const UserController = require('../controllers/UserController');
const ValidationMiddleware = require('../middleware/ValidationMiddleware');

/**
 * User routes following RESTful conventions
 */
const router = express.Router();

// User CRUD routes with validation middleware
router.post('/', ValidationMiddleware.validateUserCreate, UserController.createUser);
router.get('/stats', UserController.getUserStats);
router.get('/chart', UserController.getUsersChartData);
router.get('/export', UserController.getUsers);
router.get('/:id', ValidationMiddleware.validateUserId, UserController.getUserById);
router.put('/:id',
  ValidationMiddleware.validateUserId,
  ValidationMiddleware.validateUserUpdate,
  UserController.updateUser);
router.delete('/:id', ValidationMiddleware.validateUserId, UserController.deleteUser);

module.exports = router;
