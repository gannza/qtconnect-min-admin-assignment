const UserService = require('../../services/UserService');
const UserRepository = require('../../repositories/UserRepository');
const CryptoUtils = require('../../utils/CryptoUtils');
const { logger } = require('../../utils/Logger');
const { createError } = require('../../middleware/ErrorHandler');

// Mock dependencies
jest.mock('../../repositories/UserRepository');
jest.mock('../../utils/CryptoUtils');
jest.mock('../../utils/Logger');
jest.mock('../../middleware/ErrorHandler');

describe('UserService', () => {
  let mockCryptoUtils;
  let mockUserRepository;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Setup mocks for static methods
    mockUserRepository = UserRepository;
    mockCryptoUtils = new CryptoUtils();
    
    // Mock CryptoUtils constructor to return our mock instance
    CryptoUtils.mockImplementation(() => mockCryptoUtils);
  });

  describe('createUser', () => {
    it('should create a user successfully', async() => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        role: 'user',
        status: 'active'
      };
      
      const mockSignatureData = {
        emailHash: 'hashed_email',
        signature: { 
          signature: 'test_signature',
          publicKey: 'test_public_key',
          algorithm: 'RSA-SHA384',
          keySize: 2048,
          hashAlgorithm: 'SHA-384'
        }
      };
      
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
        status: 'active',
        emailHash: 'hashed_email',
        signature: '{"signature":"test_signature"}'
      };

      mockCryptoUtils.signUserEmail.mockReturnValue(mockSignatureData);
      mockUserRepository.create.mockResolvedValue(mockUser);

      // Act
      const result = await UserService.createUser(userData);

      // Assert
      expect(mockCryptoUtils.signUserEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        role: 'user',
        status: 'active',
        emailHash: 'hashed_email',
        signature: expect.any(String) // Base64 encoded signature
      });
      expect(result).toEqual(mockUser);
      expect(logger.info).toHaveBeenCalledWith('User created successfully', {
        userId: 1,
        email: 'test@example.com',
        role: 'user',
        status: 'active'
      });
    });

    it('should handle creation errors', async() => {
      // Arrange
      const userData = { email: 'test@example.com' };
      const error = new Error('Database error');
      
      mockCryptoUtils.signUserEmail.mockReturnValue({
        emailHash: 'hash',
        signature: { 
          signature: 'test_signature',
          publicKey: 'test_public_key',
          algorithm: 'RSA-SHA384',
          keySize: 2048,
          hashAlgorithm: 'SHA-384'
        }
      });
      mockUserRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(UserService.createUser(userData)).rejects.toThrow('Database error');
      expect(logger.error).toHaveBeenCalledWith('Failed to create user', error);
    });
  });

  describe('getUsers', () => {
    it('should get all users without pagination', async() => {
      // Arrange
      const mockUsers = [
        { id: 1, email: 'user1@example.com', role: 'user', status: 'active' },
        { id: 2, email: 'user2@example.com', role: 'admin', status: 'active' }
      ];
      
      mockUserRepository.findAll.mockResolvedValue(mockUsers);

      // Act
      const result = await UserService.getUsers();

      // Assert
      expect(mockUserRepository.findAll).toHaveBeenCalledWith({
        role: undefined,
        status: undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });

    it('should apply role and status filters', async() => {
      // Arrange
      const mockUsers = [
        { id: 1, email: 'user1@example.com', role: 'user', status: 'active' }
      ];
      
      mockUserRepository.findAll.mockResolvedValue(mockUsers);

      // Act
      const result = await UserService.getUsers({ role: 'user', status: 'active' });

      // Assert
      expect(mockUserRepository.findAll).toHaveBeenCalledWith({
        role: 'user',
        status: 'active',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(1);
      expect(result[0].role).toBe('user');
      expect(result[0].status).toBe('active');
    });

    it('should apply custom sorting', async() => {
      // Arrange
      const mockUsers = [
        { id: 1, email: 'user1@example.com', createdAt: '2023-01-01' },
        { id: 2, email: 'user2@example.com', createdAt: '2023-01-02' }
      ];
      
      mockUserRepository.findAll.mockResolvedValue(mockUsers);

      // Act
      const result = await UserService.getUsers({ 
        sortBy: 'createdAt', 
        sortOrder: 'asc' 
      });

      // Assert
      expect(mockUserRepository.findAll).toHaveBeenCalledWith({
        role: undefined,
        status: undefined,
        sortBy: 'createdAt',
        sortOrder: 'asc'
      });
      expect(result).toEqual(mockUsers);
      expect(result[0].createdAt).toBe('2023-01-01');
      expect(result[1].createdAt).toBe('2023-01-02');
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async() => {
      // Arrange
      const mockUser = { id: 1, email: 'test@example.com' };
      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await UserService.getUserById(1);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw error when user not found', async() => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);
      const mockError = new Error('User not found');
      createError.mockReturnValue(mockError);

      // Act & Assert
      await expect(UserService.getUserById(999)).rejects.toThrow('User not found');
      expect(createError).toHaveBeenCalledWith('User not found', {
        name: 'NotFoundError',
        status: 404,
        type: 'not_found_error',
        requestInfo: { operation: 'getUserById', userId: 999 }
      });
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async() => {
      // Arrange
      const existingUser = { id: 1, email: 'old@example.com' };
      const updateData = { role: 'admin' };
      const updatedUser = { id: 1, email: 'old@example.com', role: 'admin' };

      jest.spyOn(UserService, 'getUserById').mockResolvedValue(existingUser);
      mockUserRepository.updateById.mockResolvedValue(updatedUser);

      // Act
      const result = await UserService.updateUser(1, updateData);

      // Assert
      expect(UserService.getUserById).toHaveBeenCalledWith(1);
      expect(mockUserRepository.updateById).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual(updatedUser);
      expect(logger.info).toHaveBeenCalledWith('User updated successfully', {
        userId: 1,
        email: 'old@example.com',
        updatedFields: ['role']
      });
    });

    it('should update email hash when email changes', async() => {
      // Arrange
      const existingUser = { id: 1, email: 'old@example.com' };
      const updateData = { email: 'new@example.com' };
      const mockSignatureData = {
        emailHash: 'new_hash',
        signature: { 
          signature: 'new_signature',
          publicKey: 'test_public_key',
          algorithm: 'RSA-SHA384',
          keySize: 2048,
          hashAlgorithm: 'SHA-384'
        }
      };
      const updatedUser = { id: 1, email: 'new@example.com' };

      jest.spyOn(UserService, 'getUserById').mockResolvedValue(existingUser);
      mockCryptoUtils.signUserEmail.mockReturnValue(mockSignatureData);
      mockUserRepository.updateById.mockResolvedValue(updatedUser);

      // Act
      const result = await UserService.updateUser(1, updateData);

      // Assert
      expect(mockCryptoUtils.signUserEmail).toHaveBeenCalledWith('new@example.com');
      expect(mockUserRepository.updateById).toHaveBeenCalledWith(1, {
        email: 'new@example.com',
        emailHash: 'new_hash',
        signature: expect.any(String) // Base64 encoded signature
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async() => {
      // Arrange
      const existingUser = { id: 1, email: 'test@example.com' };
      jest.spyOn(UserService, 'getUserById').mockResolvedValue(existingUser);
      mockUserRepository.deleteById.mockResolvedValue(1);

      // Act
      const result = await UserService.deleteUser(1);

      // Assert
      expect(UserService.getUserById).toHaveBeenCalledWith(1);
      expect(mockUserRepository.deleteById).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
      expect(logger.info).toHaveBeenCalledWith('User deleted successfully', { userId: 1 });
    });

    it('should throw error when user not found for deletion', async() => {
      // Arrange
      jest.spyOn(UserService, 'getUserById').mockResolvedValue({ id: 1 });
      mockUserRepository.deleteById.mockResolvedValue(0);
      const mockError = new Error('User not found');
      createError.mockReturnValue(mockError);

      // Act & Assert
      await expect(UserService.deleteUser(1)).rejects.toThrow('User not found');
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics', async() => {
      // Arrange
      const mockStats = { total: 10, active: 8, inactive: 2 };
      mockUserRepository.getUserStats.mockResolvedValue(mockStats);

      // Act
      const result = await UserService.getUserStats();

      // Assert
      expect(mockUserRepository.getUserStats).toHaveBeenCalled();
      expect(result).toEqual(mockStats);
    });
  });

  describe('getUsersCreatedInLastDays', () => {
    it('should return users created in last 7 days by default', async() => {
      // Arrange
      const mockUsers = [
        { id: 1, email: 'user1@example.com', createdAt: new Date() }
      ];
      mockUserRepository.getUsersCreatedInLastDays.mockResolvedValue(mockUsers);

      // Act
      const result = await UserService.getUsersCreatedInLastDays();

      // Assert
      expect(mockUserRepository.getUsersCreatedInLastDays).toHaveBeenCalledWith(7);
      expect(result).toEqual(mockUsers);
    });

    it('should return users created in specified days', async() => {
      // Arrange
      const mockUsers = [{ id: 1, email: 'user1@example.com' }];
      mockUserRepository.getUsersCreatedInLastDays.mockResolvedValue(mockUsers);

      // Act
      const result = await UserService.getUsersCreatedInLastDays(30);

      // Assert
      expect(mockUserRepository.getUsersCreatedInLastDays).toHaveBeenCalledWith(30);
      expect(result).toEqual(mockUsers);
    });
  });
});
