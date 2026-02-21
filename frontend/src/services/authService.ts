import api from './api';
import type { LoginRequest, LoginResponse } from '@/types/api.types';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/refresh', { refreshToken });
    return response.data;
  },
};
