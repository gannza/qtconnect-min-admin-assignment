// Mock for ErrorHandler
const mockErrorHandler = {
  createError: jest.fn((message, statusCode = 500) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
  }),
  handleError: jest.fn(),
  notFound: jest.fn(),
  badRequest: jest.fn(),
  unauthorized: jest.fn(),
  forbidden: jest.fn(),
  internalServerError: jest.fn()
};

module.exports = mockErrorHandler;
