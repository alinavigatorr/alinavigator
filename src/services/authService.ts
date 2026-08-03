import { useAuthStore } from '../store/authStore';

export const authService = {
  async checkSession() {
    try {
      const res = await fetch('/api/auth/session', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        useAuthStore.getState().setUser(data.user);
      } else {
        useAuthStore.getState().setUser(null);
      }
    } catch (error) {
      useAuthStore.getState().setUser(null);
    } finally {
      useAuthStore.getState().setLoading(false);
    }
  },

  async logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
  }
};