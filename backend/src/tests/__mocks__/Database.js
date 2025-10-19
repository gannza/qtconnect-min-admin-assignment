// Mock for Database configuration
const mockDatabase = {
  initialize: jest.fn().mockResolvedValue(),
  close: jest.fn().mockResolvedValue(),
  getKnex: jest.fn().mockReturnValue({
    migrate: {
      latest: jest.fn().mockResolvedValue([])
    },
    seed: {
      run: jest.fn().mockResolvedValue([])
    },
    schema: {
      createTable: jest.fn().mockReturnThis(),
      hasTable: jest.fn().mockResolvedValue(true)
    },
    table: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
    then: jest.fn().mockResolvedValue([])
  }),
  migrate: jest.fn().mockResolvedValue()
};

module.exports = mockDatabase;
