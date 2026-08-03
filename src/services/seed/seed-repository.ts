import { SeedConfig } from './seed-config';

export interface SeedSessionRecord {
  activeProfileId: string | null;
  environment: 'development' | 'production';
  updatedAt: number;
}

export class SeedRepository {
  /**
   * خواندن وضعیت فعلی از Storage
   */
  static getSession(): SeedSessionRecord | null {
    if (!SeedConfig.isDevelopment() || typeof window === 'undefined') {
      return null;
    }

    try {
      const raw = localStorage.getItem(SeedConfig.defaults.storageKey);
      if (!raw) return null;
      return JSON.parse(raw) as SeedSessionRecord;
    } catch (error) {
      console.error('Failed to parse Seed Session from storage:', error);
      return null;
    }
  }

  /**
   * ذخیره وضعیت جدید در Storage
   */
  static saveSession(record: SeedSessionRecord): void {
    if (!SeedConfig.isDevelopment() || typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(SeedConfig.defaults.storageKey, JSON.stringify(record));
    } catch (error) {
      console.error('Failed to save Seed Session to storage:', error);
    }
  }

  /**
   * پاکسازی نشست‌های تستی
   */
  static clearSession(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(SeedConfig.defaults.storageKey);
    } catch (error) {
      console.error('Failed to clear Seed Session:', error);
    }
  }
}