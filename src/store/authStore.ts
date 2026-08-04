import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'EDITOR';
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (status: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // در ابتدا true است تا وضعیت نشست از سرور چک شود
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (status) => set({ isLoading: status }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));