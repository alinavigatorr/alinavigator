/**
 * Development Session Management Service
 * مدیریت کامل نشست‌های تستی، پایداری در LocalStorage و اعتبارسنچی پروفایل فعال.
 */

 import { SeedConfig } from './seed-config';
 import { SeedProfile } from './seed-profiles';
 import { SeedProfileRepository } from './seed-profile-repository';
 
 export interface DevSessionData {
   profileId: string;
   createdAt: number;
   expiresAt: number;
 }
 
 export class SeedSessionService {
   private static readonly SESSION_KEY = SeedConfig.defaults.storageKey;
   // مدت اعتبار نشست پیش‌فرض: ۲۴ ساعت
   private static readonly SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
 
   /**
    * دریافت پروفایل فعال فعلی (با بررسی اعتبار و انقضا)
    */
   static getActiveSessionProfile(): SeedProfile {
     if (!SeedConfig.isDevelopment() || typeof window === 'undefined') {
       return SeedProfileRepository.getDefaultProfile();
     }
 
     try {
       const rawSession = localStorage.getItem(this.SESSION_KEY);
       if (!rawSession) {
         return this.initializeDefaultSession();
       }
 
       const session: DevSessionData = JSON.parse(rawSession);
 
       // اعتبارسنجی انقضای نشست
       if (Date.now() > session.expiresAt) {
         return this.initializeDefaultSession();
       }
 
       // یافتن پروفایل مرتبط
       const profile = SeedProfileRepository.getProfileById(session.profileId);
       if (!profile) {
         return this.initializeDefaultSession();
       }
 
       return profile;
     } catch (error) {
       console.error('Failed to read Seed Session, falling back to default:', error);
       return SeedProfileRepository.getDefaultProfile();
     }
   }
 
   /**
    * تنظیم یا تغییر پروفایل فعال در نشست
    */
   static setActiveSessionProfile(profileId: string): SeedProfile {
     const profile = SeedProfileRepository.getProfileById(profileId);
     if (!profile) {
       throw new Error(`Profile with ID "${profileId}" not found in Seed data.`);
     }
 
     if (SeedConfig.isDevelopment() && typeof window !== 'undefined') {
       const sessionData: DevSessionData = {
         profileId: profile.id,
         createdAt: Date.now(),
         expiresAt: Date.now() + this.SESSION_DURATION_MS,
       };
 
       try {
         localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
       } catch (error) {
         console.error('Failed to save Seed Session:', error);
       }
     }
 
     return profile;
   }
 
   /**
    * راه‌اندازی نشست پیش‌فرض (در صورت نبود یا انقضا)
    */
   private static initializeDefaultSession(): SeedProfile {
     const defaultProfile = SeedProfileRepository.getDefaultProfile();
     
     if (SeedConfig.isDevelopment() && typeof window !== 'undefined') {
       const sessionData: DevSessionData = {
         profileId: defaultProfile.id,
         createdAt: Date.now(),
         expiresAt: Date.now() + this.SESSION_DURATION_MS,
       };
 
       try {
         localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
       } catch (error) {
         console.error('Failed to initialize default Seed Session:', error);
       }
     }
 
     return defaultProfile;
   }
 
   /**
    * پاکسازی و ریست کامل نشست تستی
    */
   static clearSession(): void {
     if (typeof window === 'undefined') return;
     try {
       localStorage.removeItem(this.SESSION_KEY);
     } catch (error) {
       console.error('Failed to clear Seed Session:', error);
     }
   }
 }