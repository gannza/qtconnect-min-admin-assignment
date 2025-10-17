const crypto = require('crypto');
const EC = require('elliptic').ec;

/**
 * Cryptographic utilities for ECDSA operations with SHA-384
 */
class CryptoUtils {
  constructor() {
    this.ecdsa = new EC('secp256k1');
    this.ecdsaKeyPair = null;
    this.initializeKeyPair();
  }

  /**
   * Initialize ECDSA key pair
   */
  initializeKeyPair() {
    try {
      // Initialize ECDSA key pair
      this.ecdsaKeyPair = this.ecdsa.genKeyPair();
    } catch (error) {
      console.error('Error initializing ECDSA key pair:', error);
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
   * Sign data using ECDSA with SHA-384
   * @param {string} data - Data to sign
   * @returns {Object} Signature information
   */
  signWithECDSA(data) {
    if (!this.ecdsaKeyPair) {
      throw new Error('ECDSA key pair not initialized');
    }

    try {
      const hash = crypto.createHash('sha384').update(data).digest();
      const signature = this.ecdsaKeyPair.sign(hash);
      
      return {
        signature: signature.toDER('hex'),
        publicKey: this.ecdsaKeyPair.getPublic('hex'),
        privateKey: this.ecdsaKeyPair.getPrivate('hex'),
        algorithm: 'ECDSA',
        curve: 'secp256k1',
        hashAlgorithm: 'SHA-384'
      };
    } catch (error) {
      throw new Error(`ECDSA signing failed: ${error.message}`);
    }
  }

  /**
   * Verify ECDSA signature with SHA-384
   * @param {string} data - Original data
   * @param {string} signature - Signature to verify (in DER format)
   * @param {string} publicKey - Public key for verification
   * @returns {boolean} True if signature is valid
   */
  verifyECDSASignature(data, signature, publicKey) {
    try {
      const hash = crypto.createHash('sha384').update(data).digest();
      const keyPair = this.ecdsa.keyFromPublic(publicKey, 'hex');
      const sigObj = this.ecdsa.signatureFromDER(signature);
      
      return keyPair.verify(hash, sigObj);
    } catch (error) {
      console.error('ECDSA verification error:', error);
      return false;
    }
  }

  /**
   * Sign user email hash with ECDSA and SHA-384
   * @param {string} email - User email
   * @returns {Object} Complete signature information
   */
  signUserEmail(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email must be a non-empty string');
    }

    try {
      const emailHash = this.generateSHA384Hash(email);
      
      // Sign with ECDSA
      const ecdsaSignature = this.signWithECDSA(emailHash);

      return {
        email,
        emailHash,
        signature: {
          signature: ecdsaSignature.signature,
          publicKey: ecdsaSignature.publicKey,
          algorithm: ecdsaSignature.algorithm,
          curve: ecdsaSignature.curve,
          hashAlgorithm: ecdsaSignature.hashAlgorithm
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
   * @param {Object} signatureData - Signature data from signUserEmail
   * @returns {Object} Verification results
   */
  verifyUserEmailSignature(email, signatureData) {
    try {
      const emailHash = this.generateSHA384Hash(email);
      
      const ecdsaValid = this.verifyECDSASignature(
        emailHash,
        signatureData.signature.signature,
        signatureData.signature.publicKey
      );

      return {
        email,
        emailHash,
        valid: ecdsaValid,
        verification: {
          ecdsa: ecdsaValid
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
   * Get current ECDSA public key
   * @returns {string} ECDSA public key
   */
  getECDSAPublicKey() {
    if (!this.ecdsaKeyPair) {
      throw new Error('ECDSA key pair not initialized');
    }
    return this.ecdsaKeyPair.getPublic('hex');
  }

  /**
   * Generate a new key pair (for key rotation)
   */
  rotateKeys() {
    this.initializeKeyPair();
  }
}

module.exports = CryptoUtils;
