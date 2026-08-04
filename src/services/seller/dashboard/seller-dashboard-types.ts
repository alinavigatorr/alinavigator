/**
 * Seller Dashboard Types & Navigation Models
 * تعریف تایپ‌ها، ماژول‌ها، دسترسی‌ها و متادیتاهای معماری Pluggable داشبورد فروشندگان.
 */

// ۱۵ ماژول اصلی داشبورد که در مانیفست مشخص شده‌اند (افزوده شدن Coupons, Campaigns, Finance, Returns)
export type DashboardModuleId =
  | 'overview'
  | 'products'
  | 'orders'
  | 'inventory'
  | 'customers'
  | 'reviews'
  | 'analytics'
  | 'wallet'
  | 'membership'
  | 'store_settings'
  | 'support'
  | 'coupons'
  | 'campaigns'
  | 'finance'
  | 'returns';

// گروه‌بندی بخش‌های مختلف داشبورد (سایدبار)
export type DashboardSectionId =
  | 'core'       // Overview, Analytics
  | 'catalog'    // Products, Inventory
  | 'sales'      // Orders, Customers, Reviews, Returns
  | 'marketing'  // Coupons, Campaigns
  | 'finance'    // Wallet, Membership, Finance
  | 'management';// Store Settings, Support

// سطوح دسترسی برای ماژول‌ها
export type SellerPermission =
  | 'view:overview'
  | 'manage:products'
  | 'view:orders'
  | 'manage:orders'
  | 'manage:inventory'
  | 'view:customers'
  | 'manage:reviews'
  | 'view:analytics'
  | 'manage:wallet'
  | 'manage:membership'
  | 'manage:settings'
  | 'manage:support'
  | 'manage:coupons'
  | 'manage:campaigns'
  | 'view:finance'
  | 'manage:returns';

export interface DashboardSection {
  id: DashboardSectionId;
  title: string;
  order: number;
}

// ساختار توسعه‌یافته ماژول برای معماری Pluggable
export interface DashboardNavItem {
  id: DashboardModuleId;
  section: DashboardSectionId;
  title: string;
  description?: string; // توضیح کوتاه برای کارت‌ها یا تولتیپ
  path: string; // مسیر URL ماژول
  iconIdentifier?: string; // شناسه آیکون برای رندر داینامیک در UI
  requiredPermissions: SellerPermission[];
  isActive: boolean; // فعال/غیرفعال بودن ماژول در سیستم
  isHidden?: boolean; // پنهان بودن از منو با وجود داشتن دسترسی
  featureFlag?: string; // کلید Feature Flag برای روشن/خاموش کردن قابلیت در سطح کلاستر
  lazyLoad?: boolean; // استراتژی بارگذاری (Lazy Loading) برای بهینه‌سازی Performance
  sortOrder?: number; // ترتیب نمایش در داخل یک Section
}