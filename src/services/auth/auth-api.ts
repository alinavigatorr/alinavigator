// src/services/auth/auth-api.ts

import { httpClient } from '../core/http-client';
import { AuthEndpoints } from './auth-endpoints';

export interface LoginPayload {
  email: string;
  password?: string;
  otp?: string;
}

export class AuthApi {
  /**
   * درخواست لاگین به مسیر داخلی (BFF) در Next.js
   * این مسیر (Route Handler) با بک‌اند واقعی تعامل کرده و HttpOnly Cookie را ست می‌کند.
   */
  static async login(payload: LoginPayload): Promise<any> {
    // requireAuth: false -> چون برای لاگین نیازی به داشتن توکن در هدر نیست
    return httpClient.post(AuthEndpoints.INTERNAL.LOGIN, payload, {
      requireAuth: false,
    });
  }

  /**
   * درخواست خروج برای پاک کردن کوکی‌های HttpOnly در مرورگر
   */
  static async logout(): Promise<void> {
    return httpClient.post(AuthEndpoints.INTERNAL.LOGOUT, undefined, {
      requireAuth: false, // فرض بر این است که مسیر خروج با خواندن کوکی کار می‌کند
    });
  }

  /**
   * درخواست رفرش توکن
   * مرورگر به صورت خودکار HttpOnly Cookie حاوی رفرش‌توکن را ارسال می‌کند
   */
  static async refreshSession(): Promise<any> {
    return httpClient.post(AuthEndpoints.INTERNAL.REFRESH, undefined, {
      requireAuth: false, 
    });
  }

  /**
   * دریافت اطلاعات نشست (Session) از طریق کوکی موجود
   */
  static async fetchSession(): Promise<any> {
    return httpClient.get(AuthEndpoints.INTERNAL.SESSION, {
      requireAuth: false,
    });
  }
}