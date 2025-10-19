// Mock for Logger
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  log: jest.fn()
};

module.exports = {
  logger: mockLogger
};
