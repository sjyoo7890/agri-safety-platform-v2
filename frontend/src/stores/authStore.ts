import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@/types';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: (accessToken, user) =>
        set({ accessToken, user, isAuthenticated: true }),
      logout: () =>
        set({ accessToken: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
