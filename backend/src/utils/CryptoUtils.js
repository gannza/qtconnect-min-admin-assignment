const crypto = require('crypto');
const KeyManager = require('./KeyManager');
const { logger } = require('./Logger');

/**
 * Cryptographic utilities for RSA operations with SHA-384
 */
class CryptoUtils {
  static #instance = null;

  /**
   * Get singleton instance of CryptoUtils
   * @returns {CryptoUtils} Singleton instance
   */
  static getInstance() {
    if (!CryptoUtils.#instance) {
      CryptoUtils.#instance = new CryptoUtils();
    }
    return CryptoUtils.#instance;
  }

  /**
   * Get initialized singleton instance of CryptoUtils
   * @returns {Promise<CryptoUtils>} Initialized singleton instance
   */
  static async getInitializedInstance() {
    const instance = CryptoUtils.getInstance();
    await instance.initialize();
    return instance;
  }

  /**
   * Initialize cryptographic utilities
   */
  constructor() {
    this.keyManager = new KeyManager();
    this.initialized = false;
  }

  /**
   * Initialize the crypto utils with key manager
   */
  async initialize() {
    if (this.initialized) {
      return;
    }
    
    try {
      await this.keyManager.initialize();
      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize CryptoUtils: ${error.message}`);
    }
  }

  /**
   * Ensure CryptoUtils is initialized
   */
  ensureInitialized() {
    if (!this.initialized) {
      throw new Error('CryptoUtils not initialized. Call initialize() first.');
    }
  }

  /**
   * Generate SHA-384 hash of the input string
   * @param {string} input - Input string to hash
   * @returns {string} SHA-384 hash in hexadecimal format
   */
  generateSHA384Hash(input) {
    if (!input || typeof input !== 'string') {
      throw new Error('Input must be a non-empty string');
    }

    const hash = crypto.createHash('sha384');
    hash.update(input);
    return hash.digest('hex');
  }


  /**
   * Sign data using RSA with SHA-384
   * @param {string} data - Data to sign
   * @returns {object} Signature information
   */
  signWithRSA(data) {
    this.ensureInitialized();

    if (!data || typeof data !== 'string') {
      throw new Error('Data must be a non-empty string');
    }

    try {
      const privateKey = this.keyManager.getPrivateKey();
      const publicKey = this.keyManager.getPublicKey();
      
      // Create signer with RSA-SHA384
      const signer = crypto.createSign('RSA-SHA384');
      signer.update(data);
      signer.end();
      
      const signature = signer.sign(privateKey, 'base64');
      
      return {
        signature,
        publicKey,
        algorithm: 'RSA-SHA384',
        keySize: 2048,
        hashAlgorithm: 'SHA-384'
      };
    } catch (error) {
      throw new Error(`RSA signing failed: ${error.message}`);
    }
  }

  /**
   * Verify RSA signature with SHA-384
   * @param {string} data - Original data
   * @param {string} signature - Signature to verify (base64 format)
   * @param {string} publicKey - Public key for verification (optional, uses internal key if not provided)
   * @returns {boolean} True if signature is valid
   */
  verifyRSASignature(data, signature, publicKey = null) {
    this.ensureInitialized();

    if (!data || typeof data !== 'string') {
      throw new Error('Data must be a non-empty string');
    }

    if (!signature || typeof signature !== 'string') {
      throw new Error('Signature must be a non-empty string');
    }

    try {
      const key = publicKey || this.keyManager.getPublicKey();
      
      const verifier = crypto.createVerify('RSA-SHA384');
      verifier.update(data);
      verifier.end();
      
      return verifier.verify(key, signature, 'base64');
    } catch (error) {
      logger.error('RSA verification error:', error);
      return false;
    }
  }

  /**
   * Sign user email hash with RSA and SHA-384
   * @param {string} email - User email
   * @returns {object} Complete signature information
   */
  signUserEmail(email) {
    this.ensureInitialized();

    if (!email || typeof email !== 'string') {
      throw new Error('Email must be a non-empty string');
    }

    try {
      const emailHash = this.generateSHA384Hash(email);
      
      // Sign with RSA-SHA384
      const rsaSignature = this.signWithRSA(emailHash);

      return {
        email,
        emailHash,
        signature: {
          signature: rsaSignature.signature,
          publicKey: rsaSignature.publicKey,
          algorithm: rsaSignature.algorithm,
          keySize: rsaSignature.keySize,
          hashAlgorithm: rsaSignature.hashAlgorithm
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`User email signing failed: ${error.message}`);
    }
  }

  /**
   * Verify user email signature
   * @param {string} email - Original email
   * @param {object} signatureData - Signature data from signUserEmail
   * @returns {object} Verification results
   */
  verifyUserEmailSignature(email, signatureData) {
    this.ensureInitialized();

    try {
      const emailHash = this.generateSHA384Hash(email);
      
      const rsaValid = this.verifyRSASignature(
        emailHash,
        signatureData.signature.signature,
        signatureData.signature.publicKey
      );

      return {
        email,
        emailHash,
        valid: rsaValid,
        verification: {
          rsa: rsaValid
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        email,
        valid: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get current RSA public key
   * @returns {string} RSA public key
   */
  getRSAPublicKey() {
    this.ensureInitialized();
    return this.keyManager.getPublicKey();
  }

  /**
   * Get key information for API responses
   * @returns {object} Key information
   */
  getKeyInfo() {
    this.ensureInitialized();
    return this.keyManager.getKeyInfo();
  }

  /**
   * Generate a new key pair (for key rotation)
   */
  async rotateKeys() {
    this.ensureInitialized();
    await this.keyManager.rotateKeys();
  }

  /**
   * Get RSA public key for email verification
   * @returns {string} RSA public key in PEM format
   */
  getRSAPublicKeyForEmail() {
    this.ensureInitialized();
    return this.keyManager.getPublicKey();
  }

  /**
   * Hash email using SHA-384
   * @param {string} email - Email to hash
   * @returns {string} SHA-384 hash in hexadecimal format
   */
  hashEmail(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email must be a non-empty string');
    }
    return crypto.createHash('sha384').update(email).digest('hex');
  }

  /**
   * Sign email hash using RSA with SHA-384
   * @param {string} email - Email to sign
   * @returns {object} Signature information
   */
  signEmail(email) {
    this.ensureInitialized();

    if (!email || typeof email !== 'string') {
      throw new Error('Email must be a non-empty string');
    }

    try {
      const hashedEmail = this.hashEmail(email);
      
      // Create signer with RSA-SHA384
      const signer = crypto.createSign('RSA-SHA384');
      signer.update(hashedEmail);
      signer.end();
      
      const privateKey = this.keyManager.getPrivateKey();
      const publicKey = this.keyManager.getPublicKey();
      const signature = signer.sign(privateKey, 'base64');
      
      return {
        email,
        hashedEmail,
        signature,
        publicKey,
        algorithm: 'RSA-SHA384',
        keySize: 2048,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Email signing failed: ${error.message}`);
    }
  }

  /**
   * Verify email signature using RSA with SHA-384
   * @param {string} email - Original email
   * @param {string} signature - Base64 encoded signature
   * @param {string} publicKey - RSA public key (optional, uses internal key if not provided)
   * @returns {boolean} True if signature is valid
   */
  verifyEmailSignature(email, signature, publicKey = null) {
    this.ensureInitialized();

    if (!email || typeof email !== 'string') {
      throw new Error('Email must be a non-empty string');
    }

    if (!signature || typeof signature !== 'string') {
      throw new Error('Signature must be a non-empty string');
    }

    try {
      const hashedEmail = this.hashEmail(email);
      const key = publicKey || this.keyManager.getPublicKey();
      
      const verifier = crypto.createVerify('RSA-SHA384');
      verifier.update(hashedEmail);
      verifier.end();
      
      return verifier.verify(key, signature, 'base64');
    } catch (error) {
      logger.error('Email signature verification error:', error);
      return false;
    }
  }

  /**
   * Get RSA public key for email verification
   * @returns {string} RSA public key in PEM format
   */
  getRSAPublicKeyForEmail() {
    return this.getRSAPublicKey();
  }
}

module.exports = CryptoUtils;
