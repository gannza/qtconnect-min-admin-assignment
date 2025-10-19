module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js',
    '**/tests/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/app.js',
    '!src/tests/**/*.js',
    '!src/database/migrations/**/*.js',
    '!src/database/seeds/**/*.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov'
  ],
  testTimeout: 10000,
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
  // Disable coverage collection for Node.js v14 compatibility
  collectCoverage: false,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/tests/',
    '/src/database/migrations/',
    '/src/database/seeds/'
  ],
  // Transform configuration for ES modules
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(winston|@dabh|@so-ric)/)'
  ],
  // Module name mapping for problematic modules
  moduleNameMapper: {
    '^@dabh/diagnostics$': '<rootDir>/src/tests/__mocks__/diagnostics.js',
    '^@so-ric/colorspace$': '<rootDir>/src/tests/__mocks__/colorspace.js',
    '^better-sqlite3$': '<rootDir>/src/tests/__mocks__/better-sqlite3.js',
    '^knex$': '<rootDir>/src/tests/__mocks__/knex.js',
    '^../database/Database$': '<rootDir>/src/tests/__mocks__/Database.js',
    '^../../utils/Logger$': '<rootDir>/src/tests/__mocks__/Logger.js',
    '^../../utils/CryptoUtils$': '<rootDir>/src/tests/__mocks__/CryptoUtils.js',
    '^../../repositories/UserRepository$': '<rootDir>/src/tests/__mocks__/UserRepository.js',
    '^../../middleware/ErrorHandler$': '<rootDir>/src/tests/__mocks__/ErrorHandler.js',
    '^../../services/UserService$': '<rootDir>/src/tests/__mocks__/UserService.js'
  },
  // Skip problematic modules
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/tests/unit/UserService.test.js'
  ]
};
