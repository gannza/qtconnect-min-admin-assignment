const User = require('../models/User');

/**
 *
 */
class UserRepository {
  /**
   * Find a user by email
   * @param {string} email - User's email address
   * @returns {Promise<User|null>} User instance or null if not found
   */
  static async findByEmail(email) {
    return User.query().where('email', email).first();
  }

  /**
   * Find all active users
   * @returns {Promise<User[]>} Array of active users
   */
  static async findActiveUsers() {
    return User.query().where('status', 'active');
  }

  /**
   * Find users by role
   * @param {string} role - User role ('admin' or 'user')
   * @returns {Promise<User[]>} Array of users with specified role
   */
  static async findUsersByRole(role) {
    return User.query().where('role', role);
  }

  /**
   * Get users created in the last N days
   * @param {number} days - Number of days to look back (default: 7)
   * @returns {Promise<User[]>} Array of recently created users
   */
  static async getUsersCreatedInLastDays(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return User.query()
      .where('createdAt', '>=', startDate)
      .orderBy('createdAt', 'desc');
  }

  /**
   * Get user statistics
   * @returns {Promise<object>} Object containing user statistics
   */
  static async getUserStats() {
    const totalUsers = await User.query().resultSize();
    const activeUsers = await User.query().where('status', 'active').resultSize();
    const adminUsers = await User.query().where('role', 'admin').resultSize();
    
    return {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      admins: adminUsers,
      regular: totalUsers - adminUsers
    };
  }

  /**
   * Create a new user
   * @param {object} userData - User data to create
   * @returns {Promise<User>} Created user instance
   */
  static async create(userData) {
    return User.query().insert(userData);
  }

  /**
   * Find a user by ID
   * @param {number} id - User ID
   * @returns {Promise<User|null>} User instance or null if not found
   */
  static async findById(id) {
    return User.query().findById(id);
  }

  /**
   * Update a user by ID
   * @param {number} id - User ID
   * @param {object} updateData - Data to update
   * @returns {Promise<User>} Updated user instance
   */
  static async updateById(id, updateData) {
    return User.query().patchAndFetchById(id, updateData);
  }

  /**
   * Delete a user by ID
   * @param {number} id - User ID
   * @returns {Promise<number>} Number of deleted rows
   */
  static async deleteById(id) {
    return User.query().deleteById(id);
  }

  /**
   * Find all users without pagination
   * @param {object} options - Query options for filtering and sorting
   * @param {string} options.role - Filter by role
   * @param {string} options.status - Filter by status
   * @param {string} options.sortBy - Sort field (default: 'createdAt')
   * @param {string} options.sortOrder - Sort order (default: 'desc')
   * @returns {Promise<User[]>} Array of all users
   */
  static async findAll(options = {}) {
    const { role, status, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    
    let query = User.query();
    
    // Apply filters
    if (role) {
      query = query.where('role', role);
    }
    if (status) {
      query = query.where('status', status);
    }
    
    // Apply sorting
    query = query.orderBy(sortBy, sortOrder);
    
    return query;
  }

  /**
   * Get all users with pagination
   * @param {object} options - Pagination options
   * @param {number} options.page - Page number (default: 1)
   * @param {number} options.limit - Items per page (default: 10)
   * @returns {Promise<object>} Object containing users and pagination info
   */
  static async findAllWithPagination(options = {}) {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      User.query()
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset),
      User.query().resultSize()
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    };
  }

  /**
   * Check if a user exists by email
   * @param {string} email - User's email address
   * @returns {Promise<boolean>} True if user exists, false otherwise
   */
  static async existsByEmail(email) {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  /**
   * Update user status
   * @param {number} id - User ID
   * @param {string} status - New status ('active' or 'inactive')
   * @returns {Promise<User>} Updated user instance
   */
  static async updateStatus(id, status) {
    return User.query().patchAndFetchById(id, { status });
  }

  /**
   * Update user role
   * @param {number} id - User ID
   * @param {string} role - New role ('admin' or 'user')
   * @returns {Promise<User>} Updated user instance
   */
  static async updateRole(id, role) {
    return User.query().patchAndFetchById(id, { role });
  }
}

module.exports = UserRepository;
