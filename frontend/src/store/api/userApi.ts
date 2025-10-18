import axios from 'axios';
import { User, UserFormData, ApiResponse, UserStats } from '../../types/index';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // For 409 errors, return the error response so we can handle it in components
    if (error.response?.status === 409) {
      return Promise.reject(error.response);
    }

    if (error?.response?.data?.error?.type==="duplicate_key_error") {
      console.log(error.response.data.error.message);
      return Promise.reject(new Error(error.response.data.error.message));
    }
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const userApi = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get('/users/export');
    return response.data;
  },

  createUser: async (userData: UserFormData): Promise<ApiResponse<User>> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: UserFormData): Promise<ApiResponse<User>> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getUserStats: async (): Promise<ApiResponse<UserStats>> => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  exportUsers: async (): Promise<Uint8Array> => {
    const response = await api.get('/users/export');
    
    // The backend returns JSON with base64-encoded protobuf data
    const base64Data = response.data.data;
    
    // Convert base64 to Uint8Array
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes;
  },

  getChartData: async (days: number = 7): Promise<ApiResponse<{ date: string; count: number }[]>> => {
    const response = await api.get(`/users/chart?days=${days}`);
    return response.data;
  },
};
