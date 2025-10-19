// Mock for UserService
const mockUserService = {
  createUser: jest.fn().mockResolvedValue({
    id: 1,
    email: 'test@example.com',
    role: 'user',
    status: 'active',
    emailHash: 'mock_hash',
    signature: 'mock_signature',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }),
  getUsers: jest.fn().mockResolvedValue([]),
  getUserById: jest.fn().mockResolvedValue({
    id: 1,
    email: 'test@example.com',
    role: 'user',
    status: 'active'
  }),
  updateUser: jest.fn().mockResolvedValue({
    id: 1,
    email: 'test@example.com',
    role: 'user',
    status: 'active'
  }),
  deleteUser: jest.fn().mockResolvedValue(true),
  getUserStats: jest.fn().mockResolvedValue({
    total: 10,
    active: 8,
    inactive: 2,
    admin: 1,
    user: 9
  }),
  getUsersChartData: jest.fn().mockResolvedValue([]),
  getUsersCreatedInLastDays: jest.fn().mockResolvedValue([])
};

module.exports = mockUserService;
