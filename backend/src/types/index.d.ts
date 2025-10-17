/**
 * Custom type definitions for the QtConnect Admin Backend
 */

// Extend Express Request interface for custom properties
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
        status: string;
      };
      requestId?: string;
      startTime?: number;
    }
  }
}

// User types
export interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateUserRequest {
  email: string;
  role: 'admin' | 'user';
  status?: 'active' | 'inactive';
}

export interface UpdateUserRequest {
  email?: string;
  role?: 'admin' | 'user';
  status?: 'active' | 'inactive';
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Cryptographic types
export interface ECDSASignature {
  signature: string;
  publicKey: string;
  privateKey: string;
  algorithm: 'ECDSA';
  curve: 'secp256k1';
  hashAlgorithm: 'SHA-384';
}

export interface UserEmailSignature {
  email: string;
  emailHash: string;
  signature: ECDSASignature;
  timestamp: string;
}

export interface SignatureVerification {
  email: string;
  emailHash: string;
  valid: boolean;
  verification: {
    ecdsa: boolean;
  };
  timestamp: string;
  error?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Health check types
export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  database: {
    connected: boolean;
    latency?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

// Metrics types
export interface MetricsData {
  http_requests_total: number;
  http_request_duration_seconds: number;
  http_server_up: number;
  memory_usage_bytes: number;
  database_operations_total: number;
}

// Protobuf types
export interface ProtobufUser {
  id: number;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

// Graph data types
export interface UserGraphData {
  date: string;
  count: number;
}

export interface UserGraphResponse {
  data: UserGraphData[];
  period: string;
  totalUsers: number;
}

// Error types
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export interface DatabaseError extends AppError {
  code?: string;
  constraint?: string;
  detail?: string;
}

// Middleware types
export interface SecurityConfig {
  helmet: any;
  rateLimit: any;
  cors: any;
  requestSize: number;
}

export interface MonitoringConfig {
  enableMetrics: boolean;
  enableLogging: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  metricsPort?: number;
}

// Configuration types
export interface DatabaseConfig {
  client: string;
  connection: {
    filename: string;
  };
  migrations: {
    directory: string;
  };
  seeds: {
    directory: string;
  };
}

export interface ServerConfig {
  port: number;
  host: string;
  environment: string;
  nodeEnv: string;
}

// Export all types
export * from './index';
