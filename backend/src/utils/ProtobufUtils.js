const protobuf = require('protobufjs');
const path = require('path');
const { logger } = require('./Logger');

/**
 * Protobuf utilities for serialization and deserialization
 */
class ProtobufUtils {
  /**
   *
   */
  constructor() {
    this.root = null;
    this.User = null;
    this.UserList = null;
    this.initialized = false;
  }

  /**
   * Initialize protobuf definitions
   */
  async initialize() {
    if (this.initialized) {
      return;
    }

    try {
      const protoPath = path.join(__dirname, '../../proto/user.proto');
      this.root = await protobuf.load(protoPath);
      
      // Load message types
      this.User = this.root.lookupType('user.User');
      this.UserList = this.root.lookupType('user.UserList');
      this.CreateUserRequest = this.root.lookupType('user.CreateUserRequest');
      this.UpdateUserRequest = this.root.lookupType('user.UpdateUserRequest');
      this.UserResponse = this.root.lookupType('user.UserResponse');
      this.UserListResponse = this.root.lookupType('user.UserListResponse');

      this.initialized = true;
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
  serializeUser(user) {
    if (!this.initialized) {
      throw new Error('ProtobufUtils not initialized');
    }

    try {
      
      const userMessage = this.User.create({
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        email_hash: user.email_hash || '',
        digital_signature: user.digital_signature || '',
        created_at: user.created_at,
        updated_at: user.updated_at
      });

      const buffer = this.User.encode(userMessage).finish();
      
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
  serializeUserList(users) {
    if (!this.initialized) {
      throw new Error('ProtobufUtils not initialized');
    }

    try {
     
      const serializedUsers = users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        email_hash: user.email_hash || '',
        digital_signature: user.digital_signature || '',
        created_at: user.created_at,
        updated_at: user.updated_at
      }));

      const userListMessage = this.UserList.create({
        users: serializedUsers,
        total_count: users.length,
        exported_at: new Date().toISOString()
      });

      const buffer = this.UserList.encode(userListMessage).finish();
      
    
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

module.exports = {
  protobufUtils: new ProtobufUtils()
};
