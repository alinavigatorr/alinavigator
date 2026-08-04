/**
 * Seller Product Service
 * لایه سرویس برای مدیریت محصولات فروشنده (Mock Data for Sprint 29)
 */

 import { SellerProductModel, SellerProductStatus } from './seller-product-types';

 const MOCK_SELLER_PRODUCTS: SellerProductModel[] = [
   {
     id: 'prod-001',
     title: 'گوشی موبایل هوشمند مدل X',
     slug: 'smartphone-model-x',
     sku: 'MOB-X-001',
     price: 25000000,
     discountPrice: 24000000,
     stockQuantity: 45,
     status: 'published',
     category: 'الکترونیک',
     brand: 'TechBrand',
     thumbnailUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80',
     createdAt: '2026-06-10T10:00:00Z',
     updatedAt: '2026-07-25T14:30:00Z',
   },
   {
     id: 'prod-002',
     title: 'هدفون بی‌سیم نویز کنسلینگ پرو',
     slug: 'wireless-headphone-pro',
     sku: 'AUD-HP-PRO',
     price: 8500000,
     stockQuantity: 0,
     status: 'out_of_stock',
     category: 'لوازم جانبی',
     brand: 'SoundMax',
     thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
     createdAt: '2026-05-15T09:15:00Z',
     updatedAt: '2026-07-30T11:00:00Z',
   },
   {
     id: 'prod-003',
     title: 'ساعت هوشمند اسپرت سری ۷',
     slug: 'smartwatch-sport-7',
     sku: 'SW-S7-003',
     price: 12000000,
     stockQuantity: 120,
     status: 'draft',
     category: 'گجت پوشیدنی',
     thumbnailUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&q=80',
     createdAt: '2026-08-01T08:00:00Z',
     updatedAt: '2026-08-01T08:00:00Z',
   },
   {
     id: 'prod-004',
     title: 'کیبورد مکانیکال گیمینگ RGB',
     slug: 'mechanical-keyboard-rgb',
     sku: 'KB-MECH-RGB',
     price: 4500000,
     stockQuantity: 15,
     status: 'hidden',
     category: 'گیمینگ',
     brand: 'GamePro',
     thumbnailUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=300&q=80',
     createdAt: '2026-04-20T16:45:00Z',
     updatedAt: '2026-05-10T09:20:00Z',
   },
   {
     id: 'prod-005',
     title: 'پایه نگهدارنده مانیتور دوگانه',
     slug: 'dual-monitor-stand',
     sku: 'ACC-MNT-DUAL',
     price: 2800000,
     stockQuantity: 0,
     status: 'archived',
     category: 'لوازم اداری',
     thumbnailUrl: 'https://images.unsplash.com/photo-1527443195645-1133f7f28990?w=300&q=80',
     createdAt: '2025-11-10T11:30:00Z',
     updatedAt: '2026-01-05T10:00:00Z',
   }
 ];
 
 export class SellerProductService {
   /**
    * دریافت لیست تمام محصولات فروشنده
    */
   static getAllProducts(): SellerProductModel[] {
     return MOCK_SELLER_PRODUCTS;
   }
 
   /**
    * دریافت محصولات بر اساس وضعیت
    */
   static getProductsByStatus(status: SellerProductStatus): SellerProductModel[] {
     return MOCK_SELLER_PRODUCTS.filter(p => p.status === status);
   }
 }