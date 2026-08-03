import { SeedConfig } from './seed-config';
import { SeedRepository, SeedSessionRecord } from './seed-repository';

export class SeedManager {
  /**
   * بررسی اینکه آیا محیط Seed مجاز و فعال است یا خیر
   */
  static isSeedEnvironmentActive(): boolean {
    return SeedConfig.isDevelopment();
  }

  /**
   * دریافت شناسه پروفایل فعال در محیط تستی
   */
  static getActiveProfileId(): string | null {
    if (!this.isSeedEnvironmentActive()) return null;

    const session = SeedRepository.getSession();
    return session ? session.activeProfileId : null;
  }

  /**
   * تنظیم یا تغییر پروفایل فعال تستی
   */
  static setActiveProfileId(profileId: string): void {
    if (!this.isSeedEnvironmentActive()) return;

    const record: SeedSessionRecord = {
      activeProfileId: profileId,
      environment: 'development',
      updatedAt: Date.now(),
    };

    SeedRepository.saveSession(record);
  }

  /**
   * ریست کردن کامل وضعیت Seed
   */
  static resetSeed(): void {
    if (!this.isSeedEnvironmentActive()) return;
    SeedRepository.clearSession();
  }
}