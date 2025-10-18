const CryptoUtils = require('../utils/CryptoUtils');
const { ProtobufUtils } = require('../utils/ProtobufUtils');
const { logger } = require('../utils/Logger');

/**
 * Public Key Service for providing key information to frontend
 */
class PublicKeyService {
  constructor() {
    this.cryptoUtils = new CryptoUtils();
  }

  /**
   * Get key information with Protobuf serialization
   * @returns {object} Key information with serialized data
   */
  static async getPublicKeyWithProtobuf() {
    try {
      // Ensure ProtobufUtils is initialized
      await ProtobufUtils.initialize();
      
      // Create a new instance for static method
      const service = new PublicKeyService();
      await service.cryptoUtils.initialize();
      
      const keyInfo = service.cryptoUtils.getKeyInfo();
      
      // Create protobuf message for public key
      const publicKeyMessage = {
        publicKey: keyInfo.publicKey,
        algorithm: keyInfo.algorithm,
        keySize: keyInfo.keySize,
        timestamp: keyInfo.timestamp
      };

      // Serialize with Protobuf using the static method
      const serializedData = await PublicKeyService.serializePublicKeyInfo(publicKeyMessage);
      
      return {
        success: true,
        data: serializedData.toString('base64')
      };
    } catch (error) {
      logger.error('Failed to get public key with Protobuf:', error);
      throw new Error(`Public key with Protobuf retrieval failed: ${error.message}`);
    }
  }

  /**
   * Get public key information in structured format
   * @returns {object} Public key information
   */
  static async getPublicKeyInfo() {
    try {
      // Create a new instance for static method
      const service = new PublicKeyService();
      await service.cryptoUtils.initialize();
      
      const keyInfo = service.cryptoUtils.getKeyInfo();
      
      return {
        success: true,
        data: {
          publicKey: keyInfo.publicKey,
          algorithm: keyInfo.algorithm,
          keySize: keyInfo.keySize,
          timestamp: keyInfo.timestamp
        }
      };
    } catch (error) {
      logger.error('Failed to get public key info:', error);
      throw new Error(`Public key info retrieval failed: ${error.message}`);
    }
  }

  /**
   * Serialize public key information with Protobuf
   * @param {object} publicKeyInfo - Public key information
   * @returns {Buffer} Serialized Protobuf buffer
   */
  static async serializePublicKeyInfo(publicKeyInfo) {
    try {
      if (!ProtobufUtils.initialized) {
        throw new Error('ProtobufUtils not initialized');
      }
      
      const message = ProtobufUtils.PublicKeyInfo.create({
        publicKey: publicKeyInfo.publicKey,
        algorithm: publicKeyInfo.algorithm,
        keySize: publicKeyInfo.keySize,
        timestamp: publicKeyInfo.timestamp
      });
      
      const errMsg = ProtobufUtils.PublicKeyInfo.verify(message);
      if (errMsg) throw Error(errMsg);
      
      return ProtobufUtils.PublicKeyInfo.encode(message).finish();
    } catch (error) {
      logger.error('Failed to serialize public key info:', error);
      throw error;
    }
  }

  /**
   * Deserialize public key information from Protobuf
   * @param {Buffer} buffer - Protobuf buffer
   * @returns {object} Public key information
   */
  async deserializePublicKeyInfo(buffer) {
    try {
      if (!ProtobufUtils.initialized) {
        throw new Error('ProtobufUtils not initialized');
      }
      
      const message = ProtobufUtils.PublicKeyInfo.decode(buffer);
      const deserializedData = ProtobufUtils.PublicKeyInfo.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
        defaults: true,
        arrays: true,
        objects: true
      });
      
      return {
        publicKey: deserializedData.publicKey,
        algorithm: deserializedData.algorithm,
        keySize: deserializedData.keySize,
        timestamp: deserializedData.timestamp
      };
    } catch (error) {
      logger.error('Failed to deserialize public key info:', error);
      throw error;
    }
  }
}

module.exports = PublicKeyService;
