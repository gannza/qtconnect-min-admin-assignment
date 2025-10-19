import { ec as EC } from 'elliptic';
import CryptoJS from 'crypto-js';
import forge from 'node-forge';
import { DecodedSignature } from '../types';

interface CryptoKeys {
  publicKey: string;
  privateKey: string;
}

interface SignatureData {
  signature: string;
  publicKey: string;
  privateKey: string;
  algorithm: string;
  curve: string;
  hashAlgorithm: string;
}

// Global crypto keys storage
let cryptoKeys: CryptoKeys | null = null;
let ecdsa: EC | null = null;

/**
 * Initialize crypto keys using ECDSA with secp256k1 curve (matching backend)
 */
export const initializeCryptoKeys = (): CryptoKeys => {
  if (cryptoKeys) {
    return cryptoKeys;
  }

  try {
    // Check localStorage first for existing keys
    const storedKeys = localStorage.getItem('crypto-keys');
    if (storedKeys) {
      const parsedKeys = JSON.parse(storedKeys);
      cryptoKeys = parsedKeys;
      // Initialize ECDSA with stored keys
      ecdsa = new EC('secp256k1');
      return cryptoKeys!;
    }

    // Initialize ECDSA with secp256k1 curve (same as backend)
    ecdsa = new EC('secp256k1');
    const keyPair = ecdsa.genKeyPair();

    const publicKey = keyPair.getPublic('hex');
    const privateKey = keyPair.getPrivate('hex');

    cryptoKeys = {
      publicKey,
      privateKey,
    };

    // Store keys in localStorage for persistence
    localStorage.setItem('crypto-keys', JSON.stringify(cryptoKeys));

    return cryptoKeys;
  } catch (error) {
    console.error('Failed to initialize crypto keys:', error);
    throw new Error('Crypto initialization failed');
  }
};

/**
 * Generate SHA-384 hash (matching backend)
 */
export const generateSHA384Hash = (input: string): string => {
  if (!input || typeof input !== 'string') {
    throw new Error('Input must be a non-empty string');
  }
  return CryptoJS.SHA384(input).toString();
};

/**
 * Hash email using SHA-384 (matching backend)
 */
export const hashEmail = (email: string): string => {
  return generateSHA384Hash(email);
};

/**
 * Sign data using ECDSA with SHA-384 (matching backend)
 */
export const signWithECDSA = (data: string): SignatureData => {
  if (!ecdsa) {
    throw new Error('ECDSA not initialized');
  }

  try {
    const keys = initializeCryptoKeys();
    const keyPair = ecdsa.keyFromPrivate(keys.privateKey, 'hex');
    
    // Create SHA-384 hash of the data
    const hash = CryptoJS.SHA384(data).toString(CryptoJS.enc.Hex);
    const hashBuffer = CryptoJS.enc.Hex.parse(hash);
    
    // Sign the hash
    const signature = keyPair.sign(hashBuffer.toString(CryptoJS.enc.Hex));
    
    return {
      signature: signature.toDER('hex'),
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
      algorithm: 'ECDSA',
      curve: 'secp256k1',
      hashAlgorithm: 'SHA-384'
    };
  } catch (error) {
    throw new Error(`ECDSA signing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Sign hash using ECDSA (matching backend implementation)
 */
export const signHash = (hash: string, privateKey: string): string => {
  try {
    if (!ecdsa) {
      throw new Error('ECDSA not initialized');
    }

    const keyPair = ecdsa.keyFromPrivate(privateKey, 'hex');
    const signature = keyPair.sign(hash);
    
    return signature.toDER('hex');
  } catch (error) {
    console.error('Failed to sign hash:', error);
    throw new Error('Signing failed');
  }
};

/**
 * Verify ECDSA signature with SHA-384 (matching backend)
 */
export const verifyECDSASignature = (
  data: string,
  signature: string,
  publicKey: string
): boolean => {
  try {
    if (!ecdsa) {
      throw new Error('ECDSA not initialized');
    }

    const hash = CryptoJS.SHA384(data).toString(CryptoJS.enc.Hex);
    const keyPair = ecdsa.keyFromPublic(publicKey, 'hex');
    // Verify with signature buffer directly (DER format)
    return keyPair.verify(hash, signature);
  } catch (error) {
    console.error('ECDSA verification error:', error);
    return false;
  }
};

/**
 * Verify signature (legacy method for compatibility)
 */
export const verifySignature = (
  hash: string, 
  signature: string, 
  publicKey: string
): boolean => {
  try {
    if (!ecdsa) {
      throw new Error('ECDSA not initialized');
    }

    const keyPair = ecdsa.keyFromPublic(publicKey, 'hex');
    // Verify with signature buffer directly (DER format)
    return keyPair.verify(hash, signature);
  } catch (error) {
    console.error('Failed to verify signature:', error);
    return false;
  }
};

/**
 * Sign user email hash with ECDSA and SHA-384 (matching backend)
 */
export const signUserEmail = (email: string) => {
  if (!email || typeof email !== 'string') {
    throw new Error('Email must be a non-empty string');
  }

  try {
    const emailHash = generateSHA384Hash(email);
    const ecdsaSignature = signWithECDSA(emailHash);

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
    throw new Error(`User email signing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Verify user email signature (matching backend)
 */
export const verifyUserEmailSignature = (email: string, signatureData: any) => {
  try {
    const emailHash = generateSHA384Hash(email);
    
    const ecdsaValid = verifyECDSASignature(
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
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Get current public key
 */
export const getPublicKey = (): string => {
  const keys = initializeCryptoKeys();
  return keys.publicKey;
};

/**
 * Get current ECDSA public key (matching backend method name)
 */
export const getECDSAPublicKey = (): string => {
  const keys = initializeCryptoKeys();
  return keys.publicKey;
};

/**
 * Generate a new key pair (for key rotation)
 */
export const rotateKeys = (): void => {
  cryptoKeys = null;
  localStorage.removeItem('crypto-keys');
  initializeCryptoKeys();
};

// Legacy methods for backward compatibility
export const generateKeyPair = () => {
  const keys = initializeCryptoKeys();
  return {
    privateKey: keys.privateKey,
    publicKey: keys.publicKey,
  };
};

export const getStoredKeys = () => {
  // Initialize crypto keys if not already done
  if (!cryptoKeys) {
    try {
      return initializeCryptoKeys();
    } catch (error) {
      console.error('Failed to get stored keys:', error);
      return null;
    }
  }
  return cryptoKeys;
};

/**
 * Decode Base64-encoded signature JSON (matching backend format)
 */
export const decodeSignature = (encodedSignature: string): DecodedSignature | null => {
  try {
    // Decode from Base64
    const jsonString = atob(encodedSignature);
    
    // Parse JSON
    const signatureData = JSON.parse(jsonString);
    
    return {
      signature: signatureData.signature,
      publicKey: signatureData.publicKey,
      algorithm: signatureData.algorithm,
      keySize: signatureData.keySize,
      hashAlgorithm: signatureData.hashAlgorithm
    };
  } catch (error) {
    console.error('Failed to decode signature:', error);
    return null;
  }
};

/**
 * Verify RSA signature using Web Crypto API
 */
export const verifyRSASignature = async (
  email: string,
  signature: string,
  publicKeyPem: string
): Promise<boolean> => {
  try {
    // Check if Web Crypto API is available
    if (!crypto || !crypto.subtle) {
      console.warn('Web Crypto API not available, falling back to simplified verification');
      return verifyRSASignatureFallback(email, signature, publicKeyPem);
    }

    // Clean the PEM format and convert to ArrayBuffer
    const cleanKey = publicKeyPem
      .replace(/-----BEGIN PUBLIC KEY-----/g, '')
      .replace(/-----END PUBLIC KEY-----/g, '')
      .replace(/\s/g, '');
    
    const keyBuffer = Uint8Array.from(atob(cleanKey), c => c.charCodeAt(0));
    
    // Import the RSA public key
    const key = await crypto.subtle.importKey(
      'spki',
      keyBuffer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-384'
      },
      false,
      ['verify']
    );
    
    // Hash the email
    const emailHash = await crypto.subtle.digest('SHA-384', new TextEncoder().encode(email));
    
    // Convert signature from base64 to ArrayBuffer
    const signatureBuffer = Uint8Array.from(atob(signature), c => c.charCodeAt(0));
    
    // Verify signature
    const isValid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      signatureBuffer,
      emailHash
    );
    
    return isValid;
  } catch (error) {
    console.error('RSA signature verification failed:', error);
    // Fallback to simplified verification
    return verifyRSASignatureFallback(email, signature, publicKeyPem);
  }
};

/**
 * Fallback RSA signature verification using node-forge (matching backend approach)
 */
export const verifyRSASignatureFallback = (
  email: string,
  signature: string,
  publicKeyPem: string
): boolean => {
  try {
    console.log('Using node-forge RSA verification (matching backend)');
    
    // Import the public key
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    
    // Convert signature from base64 to bytes
    const signatureBytes = forge.util.decode64(signature);
    console.log('Signature decoded successfully, bytes length:', signatureBytes.length);
    
    let isValid = false;
   
      try {
        // Verify against email hash
        const emailHash = generateSHA384Hash(email);
        const verifier = forge.md.sha384.create();
        verifier.update(emailHash, 'utf8');
        isValid = publicKey.verify(verifier.digest().bytes(), signatureBytes);
      } catch (e) {
        console.log('Method 2 failed:', (e as Error).message);
      }
    
    
    return isValid;

  } catch (error) {
    console.error('Node-forge RSA verification failed:', error);
    return false;
  }
};

/**
 * Verify signature using decoded signature data
 */
export const verifyDecodedSignature = async (
  email: string,
  decodedSignature: DecodedSignature
): Promise<boolean> => {
  try {
    // Check if it's RSA signature
    
      return await verifyRSASignature(
        email,
        decodedSignature.signature,
        decodedSignature.publicKey
      );
  
  } catch (error) {
    console.error('Failed to verify decoded signature:', error);
    return false;
  }
};
