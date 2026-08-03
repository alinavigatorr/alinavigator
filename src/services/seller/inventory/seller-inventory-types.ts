/**
 * Seller Inventory Domain Types
 * تعریف مدل داده‌ای موجودی و انبارداری مختص پنل فروشندگان.
 */

// وضعیت‌های ۵ گانه موجودی کالا طبق مانیفست
export type SellerStockStatus = 
  | 'in_stock' 
  | 'low_stock' 
  | 'critical_stock' 
  | 'out_of_stock' 
  | 'archived';

// اکشن‌های گروهی انبار (فقط Placeholder برای UI)
export type InventoryBulkAction = 
  | 'increase_stock' 
  | 'decrease_stock' 
  | 'import' 
  | 'export' 
  | 'archive';

// مدل اصلی موجودی انبار برای فروشنده
export interface SellerInventoryModel {
  id: string;
  productId: string; // شناسه محصول متصل به این ردیف انبار
  productTitle: string;
  thumbnailUrl?: string;
  sku: string;
  barcode?: string;
  warehouse: string; // نام یا شناسه انبار (Warehouse Badge)
  
  // مقادیر موجودی
  currentQuantity: number; // کل موجودی فیزیکی
  reservedQuantity: number; // موجودی رزرو شده (مثلاً در سفارشات در حال پردازش)
  availableQuantity: number; // موجودی قابل فروش (Current - Reserved)
  
  // تنظیمات هشدارها
  lowStockThreshold: number; // نقطه هشدار کمبود موجودی
  
  status: SellerStockStatus;
  lastRestockDate?: string; // تاریخ آخرین شارژ انبار (ISO Date)
  updatedAt: string; // ISO Date String
}