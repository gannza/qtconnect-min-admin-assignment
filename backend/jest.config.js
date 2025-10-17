module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
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
  // Disable coverage collection for Node.js v14 compatibility
  collectCoverage: false,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/tests/',
    '/src/database/migrations/',
    '/src/database/seeds/'
  ]
};
