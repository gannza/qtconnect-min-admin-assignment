const protobuf = require('protobufjs');
const path = require('path');
const { logger } = require('./Logger');

/**
 * Protobuf utilities for serialization and deserialization
 */
class ProtobufUtils {
  static root = null;
  static User = null;
  static UserList = null;
  static initialized = false;

  /**
   * Initialize protobuf definitions
   */
  static async initialize() {
    if (ProtobufUtils.initialized) {
      return;
    }

    try {
      const protoPath = path.join(__dirname, '../../proto/user.proto');
      ProtobufUtils.root = await protobuf.load(protoPath);
      
      // Load message types
      ProtobufUtils.User = ProtobufUtils.root.lookupType('user.User');
      ProtobufUtils.UserList = ProtobufUtils.root.lookupType('user.UserList');
      ProtobufUtils.CreateUserRequest = ProtobufUtils.root.lookupType('user.CreateUserRequest');
      ProtobufUtils.UpdateUserRequest = ProtobufUtils.root.lookupType('user.UpdateUserRequest');
      ProtobufUtils.UserResponse = ProtobufUtils.root.lookupType('user.UserResponse');
      ProtobufUtils.UserListResponse = ProtobufUtils.root.lookupType('user.UserListResponse');
      ProtobufUtils.PublicKeyInfo = ProtobufUtils.root.lookupType('user.PublicKeyInfo');
      ProtobufUtils.PublicKeyResponse = ProtobufUtils.root.lookupType('user.PublicKeyResponse');

      ProtobufUtils.initialized = true;
      logger.info('Protobuf definitions loaded successfully');
    } catch (error) {
      logger.error('Failed to load protobuf definitions:', error);
      throw error;
    }
  }

  /**
   * Serialize a single user to protobuf
   * @param {object} user - User object
   * @returns {Buffer} Serialized protobuf buffer
   */
  static serializeUser(user) {
    if (!ProtobufUtils.initialized) {
      throw new Error('ProtobufUtils not initialized');
    }

    try {
      
      const userMessage = ProtobufUtils.User.create({
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        emailHash: user.emailHash || '',
        signature: user.signature || '',
        createdAt: user.createdAt
      });

      // Verify payload structure
      const errMsg = ProtobufUtils.User.verify(userMessage);
      if (errMsg) throw Error(errMsg);

      const buffer = ProtobufUtils.User.encode(userMessage).finish();
      
      return buffer;
    } catch (error) {
      logger.error('Failed to serialize user to protobuf:', error);
      throw error;
    }
  }

  
  /**
   * Deserialize a single user from protobuf
   * @param {Buffer} buffer - Protobuf buffer
   * @returns {object} User object
   */
  deserializeUser(buffer) {
    if (!this.initialized) {
      throw new Error('ProtobufUtils not initialized');
    }

    try {
     
      const userMessage = this.User.decode(buffer);
      const user = this.User.toObject(userMessage, {
        longs: String,
        enums: String,
        bytes: String,
        defaults: true,
        arrays: true,
        objects: true
      });
      
      
      return user;
    } catch (error) {
      logger.error('Failed to deserialize user from protobuf:', error);
      throw error;
    }
  }

  /**
   * Serialize multiple users to protobuf
   * @param {Array} users - Array of user objects
   * @returns {Buffer} Serialized protobuf buffer
   */
  static serializeUserList(users) {
    if (!ProtobufUtils.initialized) {
      throw new Error('ProtobufUtils not initialized');
    }

    try {
     
      const serializedUsers = users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        emailHash: user.emailHash || '',
        signature: user.signature || '',
        createdAt: user.createdAt
      }));

      const userListMessage = ProtobufUtils.UserList.create({
        users: serializedUsers,
        totalCount: users.length,
        exportedAt: new Date().toISOString()
      });

      // Verify payload structure
      const errMsg = ProtobufUtils.UserList.verify(userListMessage);
      if (errMsg) throw Error(errMsg);

      const buffer = ProtobufUtils.UserList.encode(userListMessage).finish();
      
    
      return buffer;
    } catch (error) {
      logger.error('Failed to serialize user list to protobuf:', error);
      throw error;
    }
  }

  /**
   * Deserialize multiple users from protobuf
   * @param {Buffer} buffer - Protobuf buffer
   * @returns {object} Object containing users array and metadata
   */
  deserializeUserList(buffer) {
    if (!this.initialized) {
      throw new Error('ProtobufUtils not initialized');
    }

    try {
   
      
      const userListMessage = this.UserList.decode(buffer);
      const userList = this.UserList.toObject(userListMessage, {
        longs: String,
        enums: String,
        bytes: String,
        defaults: true,
        arrays: true,
        objects: true
      });
      
    
      return userList;
    } catch (error) {
    
      logger.error('Failed to deserialize user list from protobuf:', error);
      throw error;
    }
  }

  /**
   * Validate protobuf message
   * @param {object} message - Message to validate
   * @param {string} messageType - Type of message to validate against
   * @returns {object} Validation result
   */
  validateMessage(message, messageType) {
    if (!this.initialized) {
      throw new Error('ProtobufUtils not initialized');
    }

    try {
      const MessageType = this[messageType];
      if (!MessageType) {
        throw new Error(`Unknown message type: ${messageType}`);
      }

      const error = MessageType.verify(message);
      if (error) {
        return {
          valid: false,
          error
        };
      }

      return {
        valid: true,
        error: null
      };
    } catch (error) {
      logger.error('Failed to validate protobuf message:', error);
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Get protobuf schema information
   * @returns {object} Schema information
   */
  getSchemaInfo() {
    if (!this.initialized) {
      throw new Error('ProtobufUtils not initialized');
    }

    return {
      messageTypes: [
        'User',
        'UserList',
        'CreateUserRequest',
        'UpdateUserRequest',
        'UserResponse',
        'UserListResponse'
      ],
      initialized: this.initialized,
      version: '1.0.0'
    };
  }
}

// Initialize ProtobufUtils when module is loaded
ProtobufUtils.initialize().catch(error => {
  logger.error('Failed to initialize ProtobufUtils:', error);
});

module.exports = {
  ProtobufUtils
};
