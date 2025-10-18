import protobuf from 'protobufjs';
import { User, PublicKeyInfo } from '../types';

// Load the protobuf schema
const loadProtobufSchema = async () => {
  try {
    const root = await protobuf.load('src/proto/user.proto');
    return root;
  } catch (error) {
    console.error('Failed to load protobuf schema:', error);
    throw error;
  }
};

// Load the public key protobuf schema
const loadPublicKeySchema = async () => {
  try {
    const root = await protobuf.load('src/proto/publickey.proto');
    return root;
  } catch (error) {
    console.error('Failed to load public key protobuf schema:', error);
    throw error;
  }
};

// Encode users to protobuf
export const encodeUsersToProtobuf = async (users: User[]): Promise<Uint8Array> => {
  try {
    const root = await loadProtobufSchema();
    const UserList = root.lookupType('user.UserList');
    
    const userList = {
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        created_at: user.createdAt,
        email_hash: user.emailHash || '',
        signature: user.signature || '',
      }))
    };

    const message = UserList.create(userList);
    const buffer = UserList.encode(message).finish();
    return new Uint8Array(buffer);
  } catch (error) {
    console.error('Failed to encode users to protobuf:', error);
    throw error;
  }
};

// Decode protobuf to users
export const decodeProtobufToUsers = async (data: Uint8Array): Promise<User[]> => {
  try {
    const root = await loadProtobufSchema();
    const UserList = root.lookupType('user.UserList');
    
    const message = UserList.decode(data);
    const userList = UserList.toObject(message);
    
    return userList.users.map((user: any) => ({
      id: user.id, 
      email: user.email,
      role: user.role as 'admin' | 'user',
      status: user.status as 'active' | 'inactive',
      createdAt: user.createdAt,
      emailHash: user.emailHash,
      signature: user.signature,
    }));
  } catch (error) {
    throw error;
  }
};

// Deserialize public key info from protobuf
export const deserializePublicKeyInfo = async (base64Data: string): Promise<PublicKeyInfo> => {
  try {
    // Decode base64 to buffer
    const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Load the public key schema
    const root = await loadPublicKeySchema();
    const PublicKeyInfo = root.lookupType('crypto.PublicKeyInfo');
    
    // Decode the protobuf message
    const message = PublicKeyInfo.decode(buffer);
    const deserializedData = PublicKeyInfo.toObject(message, {
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
    console.error('Failed to deserialize public key info:', error);
    throw error;
  }
};
