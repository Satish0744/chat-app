import { axiosInstance } from './axios.config';
import { LoginRequest, SignupRequest, AuthResponse, ForgotPasswordRequest, ResetPasswordRequest } from '../types/auth.types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/signup', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axiosInstance.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/auth/reset-password', data);
    return response.data;
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/auth/verify-email', { token });
    return response.data;
  },
};