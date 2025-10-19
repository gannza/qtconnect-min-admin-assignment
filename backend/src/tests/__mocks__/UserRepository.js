// Mock for UserRepository
const mockUserRepository = {
  create: jest.fn().mockResolvedValue({
    id: 1,
    email: 'test@example.com',
    role: 'user',
    status: 'active',
    emailHash: 'mock_hash',
    signature: 'mock_signature',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }),
  findById: jest.fn().mockResolvedValue({
    id: 1,
    email: 'test@example.com',
    role: 'user',
    status: 'active'
  }),
  findByEmail: jest.fn().mockResolvedValue(null),
  findAll: jest.fn().mockResolvedValue([]),
  update: jest.fn().mockResolvedValue({
    id: 1,
    email: 'test@example.com',
    role: 'user',
    status: 'active'
  }),
  updateById: jest.fn().mockResolvedValue({
    id: 1,
    email: 'test@example.com',
    role: 'user',
    status: 'active'
  }),
  delete: jest.fn().mockResolvedValue(true),
  deleteById: jest.fn().mockResolvedValue(1),
  getStats: jest.fn().mockResolvedValue({
    total: 10,
    active: 8,
    inactive: 2,
    admin: 1,
    user: 9
  }),
  getUserStats: jest.fn().mockResolvedValue({
    total: 10,
    active: 8,
    inactive: 2,
    admin: 1,
    user: 9
  }),
  getChartData: jest.fn().mockResolvedValue([]),
  getUsersCreatedInLastDays: jest.fn().mockResolvedValue([])
};

module.exports = mockUserRepository;
