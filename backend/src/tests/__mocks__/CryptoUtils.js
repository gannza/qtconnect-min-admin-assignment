// Mock for CryptoUtils
class MockCryptoUtils {
  constructor() {
    this.initialized = true;
  }

  static async getInitializedInstance() {
    return new MockCryptoUtils();
  }

  signUserEmail(email) {
    return {
      emailHash: `mock_hash_${email}`,
      signature: {
        signature: 'mock_signature',
        publicKey: 'mock_public_key',
        algorithm: 'RSA-SHA384',
        keySize: 2048,
        hashAlgorithm: 'SHA-384'
      }
    };
  }

  verifySignature() {
    // Mock implementation - no console.log needed
    return true;
  }
}

module.exports = MockCryptoUtils;
