// src/services/auth/auth-endpoints.ts

export const AuthEndpoints = {
  /**
   * مسیرهای مربوط به ارتباط با بک‌اند اصلی (External API)
   */
  BACKEND: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    GET_PROFILE: '/auth/me',
    VERIFY_OTP: '/auth/verify-otp',
  },

  /**
   * مسیرهای مربوط به Next.js API Routes (BFF - Backend For Frontend)
   * این مسیرها برای مدیریت امن HttpOnly Cookies استفاده خواهند شد
   */
  INTERNAL: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    SESSION: '/api/auth/session',
  }
} as const;

export type AuthEndpointKeys = keyof typeof AuthEndpoints.BACKEND | keyof typeof AuthEndpoints.INTERNAL;