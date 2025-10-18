const UserService = require('../services/UserService');
const { protobufUtils } = require('../utils/ProtobufUtils');
const { logger } = require('../utils/Logger');
const { asyncHandler } = require('../middleware/ErrorHandler');

/**
 * User controller following SOLID principles
 */
class UserController {
  /**
   *
   */
  constructor() {
    this.userService = new UserService();
  }

  /**
   * Create a new user
   */
  static createUser = asyncHandler(async(req, res) => {

    try {
      const user = await this.userService.createUser(req.body);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      throw error;
    }
  });

  /**
   * Get all users with pagination and filtering
   */
  static getUsers = asyncHandler(async(req, res) => {
    try {
      const result = await this.userService.getUsers(req.query);

      res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      throw error;
    }
  });

  /**
   * Get user by ID
   */
  static getUserById = asyncHandler(async(req, res) => {
    try {
      const user = await this.userService.getUserById(req.params.id);

      res.json({
        success: true,
        message: 'User retrieved successfully',
        data: user
      });
    } catch (error) {
      throw error;
    }
  });

  /**
   * Update user
   */
  static updateUser = asyncHandler(async(req, res) => {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);

      res.json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      throw error;
    }
  });

  /**
   * Delete user
   */
  static deleteUser = asyncHandler(async(req, res) => {
    try {
      await this.userService.deleteUser(req.params.id);

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      throw error;
    }
  });

  /**
   * Get user statistics
   */
  static getUserStats = asyncHandler(async(req, res) => {
    try {
      const stats = await this.userService.getUserStats();

      res.json({
        success: true,
        message: 'User statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      throw error;
    }
  });

  /**
   * Export users in protobuf format
   */
  static exportUsers = asyncHandler(async(req, res) => {
    try {
      const result = await this.userService.getUsers(req.query);

      const protobufBuffer = protobufUtils.serializeUserList(result.users);

      res.set({
        'Content-Type': 'application/x-protobuf',
        'Content-Disposition': 'attachment; filename="users.pb"',
        'Content-Length': protobufBuffer.length
      });

      logger.info('Users exported in protobuf format', {
        userCount: result.users.length,
        bufferSize: protobufBuffer.length
      });

      res.send(protobufBuffer);
    } catch (error) {
      logger.error('Failed to export users in protobuf format', error);

      throw error;
    }
  });

  /**
   * Get users created in the last N days for chart data
   */
  static getUsersChartData = asyncHandler(async(req, res) => {
    try {
      const users = await this.userService.getUsersCreatedInLastDays(req.query.days);

      const chartData = users.reduce((acc, user) => {
        const [date] = new Date(user.created_at).toISOString().split('T');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const result = [];
      for (let i = parseInt(req.query.days) - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const [dateStr] = date.toISOString().split('T');
        result.push({
          date: dateStr,
          count: chartData[dateStr] || 0
        });
      }

      res.json({
        success: true,
        message: 'Chart data retrieved successfully',
        data: result
      });
    } catch (error) {
      throw error;
    }
  });
}

module.exports = UserController;
