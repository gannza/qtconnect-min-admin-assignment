export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  emailHash?: string;
  signature?: string;
}

export interface UserFormData {
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface UserStats {
  total: number,
  active: number,
  inactive: number,
  admins: number,
  regular: number,
}

export interface ChartData {
  date: string;
  count: number;
}

export interface PublicKeyInfo {
  publicKey: string;
  algorithm: string;
  keySize: number;
  timestamp: string;
}

export interface DecodedSignature {
  signature: string;
  publicKey: string;
  algorithm: string;
  keySize: number;
  hashAlgorithm: string;
}

export interface AppState {
  users: User[];
  loading: boolean;
  error: string | null;
  userStats: UserStats;
}
