/**
 * Development Seed Profile Repository
 * لایه مدیریت و دسترسی به پروفایل‌های تستی سیستم.
 */

 import { SEED_PROFILES, SeedProfile } from './seed-profiles';
 import { DevRole } from './seed-roles';
 
 export class SeedProfileRepository {
   /**
    * دریافت لیست تمام پروفایل‌های تستی
    */
   static getAllProfiles(): SeedProfile[] {
     return SEED_PROFILES;
   }
 
   /**
    * یافتن یک پروفایل بر اساس شناسه (ID)
    */
   static getProfileById(id: string): SeedProfile | null {
     const profile = SEED_PROFILES.find((p) => p.id === id);
     return profile || null;
   }
 
   /**
    * یافتن پروفایل‌ها بر اساس نقش سیستمی
    */
   static getProfilesByRole(role: DevRole): SeedProfile[] {
     return SEED_PROFILES.filter((p) => p.role === role);
   }
 
   /**
    * دریافت پروفایل پیش‌فرض سیستم (مثلاً کاربر الماسی یا ادمین)
    */
   static getDefaultProfile(): SeedProfile {
     // پیش‌فرض اول کاربر Super Admin یا Diamond است
     return SEED_PROFILES[0];
   }
 }