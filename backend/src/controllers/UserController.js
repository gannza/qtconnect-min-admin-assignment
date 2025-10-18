const UserService = require('../services/UserService');
const { ProtobufUtils } = require('../utils/ProtobufUtils');
const { logger } = require('../utils/Logger');
const { asyncHandler } = require('../middleware/ErrorHandler');

/**
 * User controller following SOLID principles
 */
class UserController {
  /**
   * Create a new user
   */
  static createUser = asyncHandler(async(req, res) => {
    try {
      const user = await UserService.createUser(req.body);

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
   * Get user by ID
   */
  static getUserById = asyncHandler(async(req, res) => {
    try {
      const user = await UserService.getUserById(req.params.id);

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
      const user = await UserService.updateUser(req.params.id, req.body);

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
      await UserService.deleteUser(req.params.id);

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
      const stats = await UserService.getUserStats();

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
  static getUsers = asyncHandler(async(req, res) => {
    try {
      const users = await UserService.getUsers(req.query);

      const protobufBuffer = ProtobufUtils.serializeUserList(users);

      res.json({
        success: true,
        data: protobufBuffer.toString('base64'),
        message: 'Users with Protobuf support retrieved successfully'
      });

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
      const users = await UserService.getUsersCreatedInLastDays(req.query.days);

      const chartData = users.reduce((acc, user) => {
        const [date] = new Date(user.createdAt).toISOString().split('T');
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
