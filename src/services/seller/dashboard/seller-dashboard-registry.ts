/**
 * Seller Dashboard Registry
 * منبع واحد حقیقت (Single Source of Truth) برای بخش‌ها و ماژول‌های داشبورد فروشندگان.
 */

 import {
  DashboardSection,
  DashboardNavItem,
  DashboardSectionId,
  DashboardModuleId
} from './seller-dashboard-types';

// ۱. تعریف گروه‌های ناوبری (Sections)
export const DASHBOARD_SECTIONS: DashboardSection[] = [
  { id: 'core', title: 'داشبورد و آمار', order: 1 },
  { id: 'catalog', title: 'کاتالوگ و انبار', order: 2 },
  { id: 'sales', title: 'فروش و مشتریان', order: 3 },
  { id: 'marketing', title: 'بازاریابی و پروموشن', order: 4 }, // گروه جدید
  { id: 'finance', title: 'مالی و اشتراک', order: 5 },
  { id: 'management', title: 'مدیریت و تنظیمات', order: 6 },
];

// ۲. ثبت ۱۵ ماژول پلاگین‌شونده داشبورد (Pluggable Modules)
export const DASHBOARD_MODULES: DashboardNavItem[] = [
  // --- Core Section ---
  {
    id: 'overview',
    section: 'core',
    title: 'پیشخوان',
    description: 'نمای کلی از وضعیت فروشگاه و عملکردهای اصلی',
    path: '/seller/dashboard',
    iconIdentifier: 'dashboard-icon',
    requiredPermissions: ['view:overview'],
    isActive: true,
    lazyLoad: false, // بارگذاری فوری برای پیشخوان
    sortOrder: 1,
  },
  {
    id: 'analytics',
    section: 'core',
    title: 'تحلیل و گزارش‌ها',
    description: 'گزارش‌های جامع از فروش، بازدیدها و نرخ تبدیل',
    path: '/seller/dashboard/analytics',
    iconIdentifier: 'chart-icon',
    requiredPermissions: ['view:analytics'],
    isActive: true,
    lazyLoad: true,
    sortOrder: 2,
  },

  // --- Catalog Section ---
  {
    id: 'products',
    section: 'catalog',
    title: 'مدیریت محصولات',
    description: 'افزودن، ویرایش و مدیریت کاتالوگ محصولات',
    path: '/seller/dashboard/products',
    iconIdentifier: 'box-icon',
    requiredPermissions: ['manage:products'],
    isActive: true,
    lazyLoad: true,
    sortOrder: 1,
  },
  {
    id: 'inventory',
    section: 'catalog',
    title: 'مدیریت موجودی',
    description: 'کنترل سطح موجودی، هشدار اتمام و انبارگردانی',
    path: '/seller/dashboard/inventory',
    iconIdentifier: 'layers-icon',
    requiredPermissions: ['manage:inventory'],
    isActive: true,
    lazyLoad: true,
    sortOrder: 2,
  },

  // --- Sales Section ---
  {
    id: 'orders',
    section: 'sales',
    title: 'سفارش‌ها',
    description: 'پیگیری و مدیریت سفارشات پردازش‌نشده و ارسال‌شده',
    path: '/seller/dashboard/orders',
    iconIdentifier: 'shopping-bag-icon',
    requiredPermissions: ['view:orders'],
    isActive: true,
    lazyLoad: true,
    sortOrder: 1,
  },
  {
    id: 'returns',
    section: 'sales',
    title: 'مرجوعی‌ها',
    description: 'مدیریت درخواست‌های مرجوعی و استرداد وجه',
    path: '/seller/dashboard/returns',
    iconIdentifier: 'return-icon',
    requiredPermissions: ['manage:returns'],
    isActive: true,
    lazyLoad: true,
    sortOrder: 2,
  },
  {
    id: 'customers',
    section: 'sales',
    title: 'مشتریان',
    description: 'لیست خریداران و تاریخچه تعاملات',
    path: '/seller/dashboard/customers',
    iconIdentifier: 'users-icon',
    requiredPermissions: ['view:customers'],
    isActive: true,
    lazyLoad: true,
    sortOrder: 3,
  },
  {
    id: 'reviews',
    section: 'sales',
    title: 'نظرات و امتیازات',
    description: 'بررسی و پاسخ به بازخوردهای خریداران',
    path: '/seller/dashboard/reviews',
    iconIdentifier: 'star-icon',
    requiredPermissions: ['manage:reviews'],
    isActive: true,
    lazyLoad: true,
    sortOrder: 4,
  },

  // --- Marketing Section ---
  {
    id: 'coupons',
    section: 'marketing',
    title: 'کدهای تخفیف',
    description: 'ایجاد و مدیریت کوپن‌های تخفیف اختصاصی',
    path: '/seller/dashboard/coupons',
    iconIdentifier: 'ticket-icon',
    requiredPermissions: ['manage:coupons'],
    isActive: true,
    lazyLoad: true,
    sortOrder: 1,
  },
  {
    id: 'campaigns',
    section: 'marketing',
    title: 'کمپین‌های فروش',
    description: 'شرکت در جشنواره‌ها و پروموشن‌های بازارچه',
    path: '/seller/dashboard/campaigns',
    iconIdentifier: 'megaphone-icon',
    requiredPermissions: ['manage:campaigns'],
    isActive: true,
    lazyLoad: true,
    featureFlag: 'enable_seller_campaigns_v1', // فعال‌سازی با Feature Flag
    sortOrder: 2,
  },

  // --- Finance Section ---
  {
    id: 'wallet',
    section: 'finance',
    title: 'کیف پول و تسویه حساب',
    description: 'موجودی قابل برداشت و درخواست‌های تسویه',
    path: '/seller/dashboard/wallet',
    iconIdentifier: 'wallet-icon',
    requiredPermissions: ['manage:wallet'],
    isActive: true,
    lazyLoad: true,
    sortOrder: 1,
  },
  {
    id: 'finance',
    section: 'finance',
    title: 'گزارشات مالی',
    description: 'اسناد حسابداری، فاکتورها و کارمزدهای پلتفرم',
    path: '/seller/dashboard/finance',
    iconIdentifier: 'receipt-icon',
    requiredPermissions: ['view:finance'],
    isActive: true,
    lazyLoad: true,
    sortOrder: 2,
  },
  {
    id: 'membership',
    section: 'finance',
    title: 'عضویت و پلن‌ها',
    description: 'مدیریت سطح عضویت و دسترسی‌های ویژه',
    path: '/seller/dashboard/membership',
    iconIdentifier: 'crown-icon',
    requiredPermissions: ['manage:membership'],
    isActive: true,
    lazyLoad: true,
    sortOrder: 3,
  },

  // --- Management Section ---
  {
    id: 'store_settings',
    section: 'management',
    title: 'تنظیمات فروشگاه',
    description: 'پروفایل حقوقی، برندینگ و تنظیمات ارسال',
    path: '/seller/dashboard/settings',
    iconIdentifier: 'settings-icon',
    requiredPermissions: ['manage:settings'],
    isActive: true,
    lazyLoad: true,
    sortOrder: 1,
  },
  {
    id: 'support',
    section: 'management',
    title: 'پشتیبانی فروشندگان',
    description: 'ارتباط با تیم پشتیبانی بازارچه و تیکت‌ها',
    path: '/seller/dashboard/support',
    iconIdentifier: 'headset-icon',
    requiredPermissions: ['manage:support'],
    isActive: true,
    lazyLoad: true,
    sortOrder: 2,
  },
];

export class SellerDashboardRegistry {
  /**
   * دریافت تمامی گروه‌های داشبورد مرتب شده بر اساس فیلد order
   */
  static getSections(): DashboardSection[] {
    return [...DASHBOARD_SECTIONS].sort((a, b) => a.order - b.order);
  }

  /**
   * دریافت تمامی ماژول‌های فعال داشبورد که پنهان نیستند
   */
  static getActiveModules(): DashboardNavItem[] {
    return DASHBOARD_MODULES.filter((m) => m.isActive && !m.isHidden);
  }

  /**
   * دریافت ماژول‌های مرتبط با یک گروه خاص (Section) و مرتب‌شده
   */
  static getModulesBySection(sectionId: DashboardSectionId): DashboardNavItem[] {
    return this.getActiveModules()
      .filter((m) => m.section === sectionId)
      .sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99)); // مرتب‌سازی بر اساس sortOrder
  }

  /**
   * دریافت یک ماژول خاص بر اساس شناسه آن
   */
  static getModuleById(moduleId: DashboardModuleId): DashboardNavItem | null {
    return DASHBOARD_MODULES.find((m) => m.id === moduleId) || null;
  }
}