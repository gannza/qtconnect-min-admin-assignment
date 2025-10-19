require('dotenv').config();
// Set test environment
process.env.NODE_ENV = 'test';
process.env.DB_FILENAME = ':memory:';

// Mock database for tests
const database = {
  initialize: jest.fn().mockResolvedValue(),
  close: jest.fn().mockResolvedValue(),
  migrate: jest.fn().mockResolvedValue(),
  getKnex: jest.fn().mockReturnValue({
    table: jest.fn().mockReturnThis(),
    del: jest.fn().mockResolvedValue()
  })
};

beforeAll(async() => {
  await database.initialize();
  await database.migrate();
//   await database.seed();
});

afterAll(async() => {
  await database.close();
});