const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { logger } = require('./Logger');

/**
 * Key Manager for RSA key pair storage and retrieval
 */
class KeyManager {
  constructor() {
    this.keysDir = path.join(process.cwd(), 'keys');
    this.privateKeyPath = path.join(this.keysDir, 'private.pem');
    this.publicKeyPath = path.join(this.keysDir, 'public.pem');
    this.privateKey = null;
    this.publicKey = null;
  }

  /**
   * Initialize key manager and load/create keys
   */
  async initialize() {
    try {
      // Ensure keys directory exists
      if (!fs.existsSync(this.keysDir)) {
        fs.mkdirSync(this.keysDir, { recursive: true });
        logger.info('Created keys directory');
      }

      // Load or create keys
      await this.loadOrCreateKeys();
      logger.info('KeyManager initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize KeyManager:', error);
      throw error;
    }
  }

  /**
   * Load existing keys or create new ones
   */
  async loadOrCreateKeys() {
    try {
      if (fs.existsSync(this.privateKeyPath) && fs.existsSync(this.publicKeyPath)) {
        // Load existing keys
        this.privateKey = fs.readFileSync(this.privateKeyPath, 'utf8');
        this.publicKey = fs.readFileSync(this.publicKeyPath, 'utf8');
        logger.info('Loaded existing RSA keys');
      } else {
        // Generate new key pair
        await this.generateNewKeyPair();
        logger.info('Generated new RSA keypair');
      }
    } catch (error) {
      logger.error('Failed to load or create keys:', error);
      throw error;
    }
  }

  /**
   * Generate new RSA key pair
   */
  async generateNewKeyPair() {
    try {
      const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      });

      this.privateKey = keyPair.privateKey;
      this.publicKey = keyPair.publicKey;

      // Save keys to files
      fs.writeFileSync(this.privateKeyPath, this.privateKey);
      fs.writeFileSync(this.publicKeyPath, this.publicKey);

      logger.info('RSA key pair generated and saved');
    } catch (error) {
      logger.error('Failed to generate RSA key pair:', error);
      throw error;
    }
  }

  /**
   * Get private key
   * @returns {string} RSA private key in PEM format
   */
  getPrivateKey() {
    if (!this.privateKey) {
      throw new Error('Private key not available. Initialize KeyManager first.');
    }
    return this.privateKey;
  }

  /**
   * Get public key
   * @returns {string} RSA public key in PEM format
   */
  getPublicKey() {
    if (!this.publicKey) {
      throw new Error('Public key not available. Initialize KeyManager first.');
    }
    return this.publicKey;
  }

  /**
   * Get key information for API responses
   * @returns {object} Key information
   */
  getKeyInfo() {
    return {
      publicKey: this.getPublicKey(),
      algorithm: 'RSA-SHA384',
      keySize: 2048,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Rotate keys (generate new key pair)
   */
  async rotateKeys() {
    try {
      await this.generateNewKeyPair();
      logger.info('Keys rotated successfully');
    } catch (error) {
      logger.error('Failed to rotate keys:', error);
      throw error;
    }
  }

  /**
   * Check if keys exist
   * @returns {boolean} True if keys exist
   */
  keysExist() {
    return fs.existsSync(this.privateKeyPath) && fs.existsSync(this.publicKeyPath);
  }
}

module.exports = KeyManager;
