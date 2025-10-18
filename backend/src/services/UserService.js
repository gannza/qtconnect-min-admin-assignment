const UserRepository = require('../repositories/UserRepository');
const CryptoUtils = require('../utils/CryptoUtils');
const { logger } = require('../utils/Logger');
const { createError } = require('../middleware/ErrorHandler');

/**
 * User service following SOLID principles
 */
class UserService {
  /**
   *
   */
  constructor() {
    this.cryptoUtils = new CryptoUtils();
  }

  /**
   * Create a new user
   * @param {object} userData - User data
   * @returns {Promise<object>} Created user
   */
  async createUser(userData) {
   
    try {
      // Generate email hash and digital signature
      const signatureData = this.cryptoUtils.signUserEmail(userData.email);
      
      // Prepare user data for creation
      const userToCreate = {
        email: userData.email,
        role: userData.role || 'user',
        status: userData.status || 'active',
        email_hash: signatureData.emailHash,
        digital_signature: JSON.stringify(signatureData.signatures)
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
   * Get all users with optional filtering and pagination
   * @param {object} options - Query options
   * @returns {Promise<object>} Users and pagination info
   */
  async getUsers(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        role,
        status,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = options;

      // Use repository for pagination
      const result = await UserRepository.findAllWithPagination({
        page,
        limit
      });
      
      let { users } = result;
      const totalCount = result.pagination.total;

      // Apply additional filters if needed
      if (role || status) {
        users = users.filter(user => {
          if (role && user.role !== role) return false;
          if (status && user.status !== status) return false;
          return true;
        });
      }

      // Apply sorting
      users.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });

      return {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      };
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
  async getUserById(userId) {
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
  async updateUser(userId, updateData) {
    try {
      // Check if user exists
      const existingUser = await this.getUserById(userId);

      // If email is being updated, generate new hash and signature
      const updatedData = { ...updateData };
      if (updateData.email && updateData.email !== existingUser.email) {
        const signatureData = this.cryptoUtils.signUserEmail(updateData.email);
        updatedData.email_hash = signatureData.emailHash;
        updatedData.digital_signature = JSON.stringify(signatureData.signatures);
      }

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
  async deleteUser(userId) {
    try {
      // Check if user exists
      await this.getUserById(userId);

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
  async getUserStats() {
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
  async getUsersCreatedInLastDays(days = 7) {
    try {
      const users = await UserRepository.getUsersCreatedInLastDays(days);
      
      return users;
    } catch (error) {
      logger.error('Failed to get users created in last days', error);
      throw error;
    }
  }

  /**
   * Update user count metrics
   * @returns {Promise<void>}
   */
}

module.exports = UserService;
