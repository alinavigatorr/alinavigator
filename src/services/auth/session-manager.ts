// src/services/auth/session-manager.ts

import { UserSession } from './types/auth-types';

export class SessionManager {
  private memorySession: UserSession | null = null;

  /**
   * ذخیره اطلاعات نشست کاربری
   */
  setSession(session: UserSession): void {
    this.memorySession = session;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user_session', JSON.stringify(session));
    }
  }

  /**
   * بازیابی اطلاعات نشست کاربری
   */
  getSession(): UserSession | null {
    if (this.memorySession) {
      return this.memorySession;
    }
    
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('auth_user_session');
      if (stored) {
        try {
          return JSON.parse(stored) as UserSession;
        } catch (error) {
          console.error('[SessionManager] Failed to parse stored session', error);
          return null;
        }
      }
    }
    
    return null;
  }

  /**
   * بررسی اعتبار نشست فعلی بر اساس زمان انقضا
   */
  isValid(): boolean {
    const session = this.getSession();
    
    if (!session || !session.isAuthenticated) {
      return false;
    }

    // اگر زمان انقضا تنظیم شده باشد، آن را با زمان فعلی مقایسه می‌کنیم
    if (session.expiresAt) {
      const currentTime = Date.now();
      return currentTime < session.expiresAt;
    }

    return true;
  }

  /**
   * پاکسازی کامل نشست کاربری
   */
  clearSession(): void {
    this.memorySession = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user_session');
    }
  }
}

// Singleton export
export const sessionManager = new SessionManager();