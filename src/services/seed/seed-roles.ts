/**
 * Development Seed Roles & Membership Definitions
 * تعریف نقش‌های سیستمی و سطوح عضویت برای محیط توسعه تستی.
 */

 export type DevRole = 
 | 'Super Admin'
 | 'Customer'
 | 'Premium Customer'
 | 'Diamond Customer'
 | 'Seller'
 | 'Support Agent'
 | 'Courier'
 | 'Guest';

export type DevMembershipTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'None';

export interface DevRoleDefinition {
 role: DevRole;
 description: string;
 defaultTier: DevMembershipTier;
 permissions: string[];
}

export const DEV_ROLE_DEFINITIONS: Record<DevRole, DevRoleDefinition> = {
 'Super Admin': {
   role: 'Super Admin',
   description: 'مدیر کل سیستم با دسترسی کامل به تمامی بخش‌ها',
   defaultTier: 'Diamond',
   permissions: ['all'],
 },
 'Diamond Customer': {
   role: 'Diamond Customer',
   description: 'مشتری ویژه با بالاترین سطح مزایای وفاداری',
   defaultTier: 'Diamond',
   permissions: ['shop', 'loyalty:diamond', 'cashback:high'],
 },
 'Premium Customer': {
   role: 'Premium Customer',
   description: 'مشتری سطح بالا با مزایای اختصاصی',
   defaultTier: 'Gold',
   permissions: ['shop', 'loyalty:premium', 'cashback:medium'],
 },
 'Customer': {
   role: 'Customer',
   description: 'مشتری عادی فروشگاه',
   defaultTier: 'Bronze',
   permissions: ['shop', 'loyalty:standard'],
 },
 'Seller': {
   role: 'Seller',
   description: 'فروشنده کالا و خدمات در پلتفرم',
   defaultTier: 'None',
   permissions: ['products:manage', 'orders:fulfill'],
 },
 'Support Agent': {
   role: 'Support Agent',
   description: 'پشتیبان و اپراتور پاسخگویی به مشتریان',
   defaultTier: 'None',
   permissions: ['support:tickets', 'users:view'],
 },
 'Courier': {
   role: 'Courier',
   description: 'پیک تحویل سفارشات',
   defaultTier: 'None',
   permissions: ['orders:deliver'],
 },
 'Guest': {
   role: 'Guest',
   description: 'کاربر مهمان بدون حساب کاربری فعال',
   defaultTier: 'None',
   permissions: ['shop:read'],
 },
};