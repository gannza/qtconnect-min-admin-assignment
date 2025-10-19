// Mock for better-sqlite3
class MockDatabase {
  constructor(filename, options = {}) {
    this.filename = filename;
    this.options = options;
    this.data = new Map();
  }

  prepare() {
    return {
      run: () => ({ changes: 1, lastInsertRowid: 1 }),
      get: () => ({ id: 1, email: 'test@example.com' }),
      all: () => [{ id: 1, email: 'test@example.com' }]
    };
  }

  exec() {
    return { changes: 1 };
  }

  close() {
    return true;
  }
}

module.exports = MockDatabase;
