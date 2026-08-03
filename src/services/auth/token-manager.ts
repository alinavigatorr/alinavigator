// src/services/auth/token-manager.ts

export class TokenManager {
  private memoryAccessToken: string | null = null;

  /**
   * ذخیره اکسس توکن در حافظه موقت (Closure)
   * حل بدهی فنی امنیتی (TD-01): استفاده از LocalStorage به دلیل خطر XSS کاملاً متوقف شد.
   * پارامتر رفرش‌توکن نادیده گرفته می‌شود زیرا فقط باید در HttpOnly Cookie سمت سرور ذخیره شود.
   */
  setTokens(accessToken: string, _refreshToken?: string): void {
    this.memoryAccessToken = accessToken;
    // کدهای localStorage برای همیشه حذف شدند
  }

  /**
   * بازیابی اکسس توکن از حافظه
   */
  getAccessToken(): string | null {
    return this.memoryAccessToken;
  }

  /**
   * پاکسازی توکن از حافظه (هنگام خروج از حساب)
   */
  clearTokens(): void {
    this.memoryAccessToken = null;
    // کدهای localStorage برای همیشه حذف شدند
  }
}

// Singleton export
export const tokenManager = new TokenManager();