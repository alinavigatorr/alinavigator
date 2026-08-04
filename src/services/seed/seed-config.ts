/**
 * Development Seed Configuration
 * این فایل صرفاً وظیفه تشخیص محیط اجرایی و تنظیمات پایه Seed را بر عهده دارد.
 */

 export const SeedConfig = {
  /**
   * بررسی اینکه آیا برنامه در محیط توسعه (Localhost / Development) اجرا می‌شود یا خیر.
   */
  isDevelopment(): boolean {
    // بررسی متغیر محیطی Next.js
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      return true;
    }
    
    // بررسی سمت کلاینت برای اطمینان از اجرای روی لوکال‌هاست
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      return hostname === 'localhost' || hostname === '127.0.0.1';
    }

    return false;
  },

  /**
   * پیش‌فرض‌های محیط Seed
   */
  defaults: {
    storageKey: '__dev_seed_session_v1__',
    enabledByDefault: true,
  }
};