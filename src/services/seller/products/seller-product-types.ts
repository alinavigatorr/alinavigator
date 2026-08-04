/**
 * Seller Product Domain Types
 * تعریف مدل داده‌ای محصولات مختص پنل فروشندگان (ایزوله از محصولات عمومی وب‌سایت).
 */

// وضعیت‌های پنج‌گانه محصول طبق مانیفست
export type SellerProductStatus = 
  | 'published' 
  | 'draft' 
  | 'hidden' 
  | 'out_of_stock' 
  | 'archived';

// اکشن‌های گروهی مجاز طبق مانیفست
export type ProductBulkAction = 
  | 'publish' 
  | 'hide' 
  | 'delete' 
  | 'duplicate' 
  | 'export';

export interface SellerProductModel {
  id: string;
  title: string;
  slug: string;
  sku: string; // کد یکتای محصول برای انبارداری
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  status: SellerProductStatus;
  category: string;
  brand?: string;
  thumbnailUrl: string;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}