const UserRepository = require('../repositories/UserRepository');
const CryptoUtils = require('../utils/CryptoUtils');
const { logger } = require('../utils/Logger');
const { createError } = require('../middleware/ErrorHandler');

/**
 * User service following SOLID principles
 */
class UserService {
  /**
   * Create a new user
   * @param {object} userData - User data
   * @returns {Promise<object>} Created user
   */
  static async createUser(userData) {
    try {
      // Generate email hash and digital signature
      const cryptoUtils = await CryptoUtils.getInitializedInstance();
      const signatureData = cryptoUtils.signUserEmail(userData.email);
      const encodedSignature = Buffer.from(
        JSON.stringify(signatureData.signature)
      ).toString('base64');

      const userToCreate = {
        email: userData.email,
        role: userData.role || 'user',
        status: userData.status || 'active',
        emailHash: signatureData.emailHash,
        // Encode the signature for storage (Base64 encoding)
        signature: encodedSignature,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Create user in database
      const user = await UserRepository.create(userToCreate);

      // Log successful creation
      logger.info('User created successfully', {
        userId: user.id,
        email: user.email,
        role: user.role,
        status: user.status
      });

      return user;
    } catch (error) {
      logger.error('Failed to create user', error);
      throw error;
    }
  }

  /**
   * Get all users with optional filtering and sorting
   * @param {object} options - Query options
   * @returns {Promise<User[]>} Array of users
   */
  static async getUsers(options = {}) {
    try {
      const {
        role,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      // Use repository to get all users with filtering and sorting
      const users = await UserRepository.findAll({
        role,
        status,
        sortBy,
        sortOrder
      });

      return users;
    } catch (error) {
      logger.error('Failed to get users', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise<object>} User object
   */
  static async getUserById(userId) {
    try {
      const user = await UserRepository.findById(userId);

      if (!user) {
        const error = createError('User not found', {
          name: 'NotFoundError',
          status: 404,
          type: 'not_found_error',
          requestInfo: { operation: 'getUserById', userId }
        });
        throw error;
      }

      return user;
    } catch (error) {
      logger.error('Failed to get user by ID', error);
      throw error;
    }
  }

  /**
   * Update user
   * @param {number} userId - User ID
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} Updated user
   */
  static async updateUser(userId, updateData) {
    try {
      // Check if user exists
      const existingUser = await UserService.getUserById(userId);
      // If email is being updated, generate new hash and signature
      const updatedData = { ...updateData };
      if (updateData.email && updateData.email !== existingUser.email) {
        const cryptoUtils = await CryptoUtils.getInitializedInstance();
        const signatureData = cryptoUtils.signUserEmail(updateData.email);
        updatedData.emailHash = signatureData.emailHash;
        // Encode the signature for storage (Base64 encoding)
        updatedData.signature = Buffer.from(
          JSON.stringify(signatureData.signature)
        ).toString('base64');
      }

      // Always update the updatedAt timestamp
      updatedData.updatedAt = new Date().toISOString();

      // Update user
      const user = await UserRepository.updateById(userId, updatedData);

      logger.info('User updated successfully', {
        userId: user.id,
        email: user.email,
        updatedFields: Object.keys(updateData)
      });

      return user;
    } catch (error) {
      logger.error('Failed to update user', error);
      throw error;
    }
  }

  /**
   * Delete user
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteUser(userId) {
    try {
      // Check if user exists
      await UserService.getUserById(userId);

      // Delete user
      const deletedCount = await UserRepository.deleteById(userId);

      if (deletedCount === 0) {
        throw createError('User not found', {
          name: 'NotFoundError',
          status: 404,
          type: 'not_found_error',
          requestInfo: { operation: 'deleteUser', userId }
        });
      }

      logger.info('User deleted successfully', { userId });

      return true;
    } catch (error) {
      logger.error('Failed to delete user', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   * @returns {Promise<object>} User statistics
   */
  static async getUserStats() {
    try {
      const stats = await UserRepository.getUserStats();

      return stats;
    } catch (error) {
      logger.error('Failed to get user stats', error);
      throw error;
    }
  }

  /**
   * Get users created in the last N days
   * @param {number} days - Number of days
   * @returns {Promise<Array>} Users created in the specified period
   */
  static async getUsersCreatedInLastDays(days = 7) {
    try {
      const users = await UserRepository.getUsersCreatedInLastDays(days);

      return users;
    } catch (error) {
      logger.error('Failed to get users created in last days', error);
      throw error;
    }
  }
}

module.exports = UserService;
