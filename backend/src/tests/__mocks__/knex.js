// Mock for Knex.js
const mockKnex = {
  migrate: {
    latest: jest.fn().mockResolvedValue([]),
    rollback: jest.fn().mockResolvedValue([]),
    status: jest.fn().mockResolvedValue([])
  },
  seed: {
    run: jest.fn().mockResolvedValue([])
  },
  schema: {
    createTable: jest.fn().mockReturnThis(),
    dropTable: jest.fn().mockReturnThis(),
    hasTable: jest.fn().mockResolvedValue(true)
  },
  table: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  whereIn: jest.fn().mockReturnThis(),
  first: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
  then: jest.fn().mockResolvedValue([]),
  catch: jest.fn().mockResolvedValue([]),
  finally: jest.fn().mockResolvedValue([]),
  destroy: jest.fn().mockResolvedValue(),
  raw: jest.fn().mockResolvedValue([])
};

// Mock the knex function
const knex = jest.fn(() => mockKnex);

// Add static methods
knex.migrate = mockKnex.migrate;
knex.seed = mockKnex.seed;

module.exports = knex;
