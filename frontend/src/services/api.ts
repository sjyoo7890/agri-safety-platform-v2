import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { getMockResponse } from './mockData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: JWT 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 네트워크 오류 시 모의 데이터 반환 (데모 모드)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 백엔드 미연결 시 모의 데이터로 대체
    const isNetworkError = !error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED';
    const isDevToken = useAuthStore.getState().accessToken?.startsWith('dev-token-');

    if (isNetworkError && isDevToken) {
      const url = error.config?.url || '';
      const method = (error.config?.method || 'get').toLowerCase();
      const mockData = getMockResponse(url, method);

      if (mockData !== null) {
        console.debug(`[데모 모드] ${method.toUpperCase()} ${url} → 모의 데이터 반환`);
        return { data: mockData, status: 200, statusText: 'OK (Mock)', headers: {}, config: error.config };
      }
    }

    // 401 시 로그아웃 (개발 토큰 제외)
    if (error.response?.status === 401 && !isDevToken) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
