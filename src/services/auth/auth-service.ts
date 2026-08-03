// src/services/auth/auth-service.ts

import { AuthApi } from './auth-api';
import { tokenManager } from './token-manager';
import { sessionManager } from './session-manager';
import { LoginResult, LogoutResult, UserSession, UserRole } from './types/auth-types';
import { SessionNotFoundError } from './auth-errors';
import { BaseNetworkError } from '../core/network-errors';

export class AuthService {
  /**
   * لاگین (یکپارچه شده با معماری جدید BFF و HttpOnly)
   */
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      // ==========================================
      // NEW NEXT.JS BFF INTEGRATION (HTTP-ONLY)
      // ==========================================
      // در فازهای بعدی این کد جایگزین شبیه‌ساز می‌شود:
      // const response = await AuthApi.login({ email, password });
      // tokenManager.setTokens(response.accessToken);
      // sessionManager.setSession(response.session);

      // SIMULATED MOCK (سازگار با معماری جدید بدون رفرش‌توکن در کلاینت):
      const mockAccessToken = 'mock_access_token_123';
      const mockSession: UserSession = {
        user: { 
          uid: 'USR-FRONT-1', 
          email, 
          role: 'CUSTOMER' as UserRole, 
          permissions: ['READ_DASHBOARD', 'MANAGE_ORDERS'] 
        },
        isAuthenticated: true,
        expiresAt: Date.now() + 3600 * 1000 // 1 hour validity
      };

      // رفرش‌توکن حذف شد چون منحصراً توسط HttpOnly Cookie مدیریت خواهد شد
      tokenManager.setTokens(mockAccessToken);
      sessionManager.setSession(mockSession);

      return { success: true, data: { session: mockSession } };
    } catch (error: any) {
      if (error instanceof BaseNetworkError) {
        return { success: false, error: { code: error.code, message: error.message } };
      }
      return { success: false, error: { code: 'LOGIN_FAILED', message: error.message } };
    }
  }

  /**
   * خروج از حساب (Logout)
   */
  async logout(): Promise<LogoutResult> {
    try {
      // FUTURE API CALL (BFF):
      // await AuthApi.logout();

      tokenManager.clearTokens();
      sessionManager.clearSession();

      return { success: true };
    } catch (error: any) {
      if (error instanceof BaseNetworkError) {
        return { success: false, error: { code: error.code, message: error.message } };
      }
      return { success: false, error: { code: 'LOGOUT_FAILED', message: error.message } };
    }
  }

  /**
   * بررسی اعتبار نشست فعلی
   */
  isAuthenticated(): boolean {
    return sessionManager.isValid();
  }

  /**
   * دریافت ایمن نشست فعلی
   */
  getCurrentSession(): UserSession {
    if (!this.isAuthenticated()) {
      throw new SessionNotFoundError();
    }
    const session = sessionManager.getSession();
    if (!session) throw new SessionNotFoundError();
    
    return session;
  }
}

// Singleton export
export const authService = new AuthService();