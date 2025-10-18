require('dotenv').config();
// Set test environment
process.env.NODE_ENV = 'test';
process.env.DB_FILENAME = ':memory:';

//Set up database connection
const { database } = require('../database/Database');

beforeAll(async() => {
  await database.initialize();
  await database.migrate();
//   await database.seed();
});

afterAll(async() => {
  await database.close();
});

// Clear database between tests
beforeEach(async() => {
  const knex = database.getKnex();
  await knex('users').del();
});
  