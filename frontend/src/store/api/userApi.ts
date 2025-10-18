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
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const userApi = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get('/users');
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
    const response = await api.get('/users/export', {
      responseType: 'arraybuffer',
    });
    
    // Convert ArrayBuffer to Uint8Array for protobuf decoding
    return new Uint8Array(response.data);
  },

  getChartData: async (days: number = 7): Promise<ApiResponse<{ date: string; count: number }[]>> => {
    const response = await api.get(`/users/chart?days=${days}`);
    return response.data;
  },
};
