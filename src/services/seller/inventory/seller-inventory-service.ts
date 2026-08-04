/**
 * Seller Inventory Service
 * لایه سرویس برای مدیریت موجودی انبار فروشنده (Mock Data for Sprint 29)
 */

 import { SellerInventoryModel, SellerStockStatus } from './seller-inventory-types';

 const MOCK_INVENTORY: SellerInventoryModel[] = [
   {
     id: 'inv-001',
     productId: 'prod-001',
     productTitle: 'گوشی موبایل هوشمند مدل X',
     sku: 'MOB-X-001',
     barcode: '6260000001234',
     warehouse: 'انبار مرکزی تهران',
     currentQuantity: 150,
     reservedQuantity: 30,
     availableQuantity: 120,
     lowStockThreshold: 20,
     status: 'in_stock',
     thumbnailUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&q=80',
     lastRestockDate: '2026-07-25T10:00:00Z',
     updatedAt: '2026-08-01T08:30:00Z',
   },
   {
     id: 'inv-002',
     productId: 'prod-004',
     productTitle: 'کیبورد مکانیکال گیمینگ RGB',
     sku: 'KB-MECH-RGB',
     barcode: '6260000005678',
     warehouse: 'انبار شماره ۲ - کرج',
     currentQuantity: 15,
     reservedQuantity: 5,
     availableQuantity: 10,
     lowStockThreshold: 15,
     status: 'low_stock',
     thumbnailUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=100&q=80',
     lastRestockDate: '2026-06-15T09:15:00Z',
     updatedAt: '2026-07-30T11:00:00Z',
   },
   {
     id: 'inv-003',
     productId: 'prod-015',
     productTitle: 'هدفون بلوتوثی اسپرت',
     sku: 'AUD-HP-SPORT',
     warehouse: 'انبار مرکزی تهران',
     currentQuantity: 3,
     reservedQuantity: 1,
     availableQuantity: 2,
     lowStockThreshold: 10,
     status: 'critical_stock',
     thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80',
     lastRestockDate: '2026-05-20T14:00:00Z',
     updatedAt: '2026-08-01T09:15:00Z',
   },
   {
     id: 'inv-004',
     productId: 'prod-002',
     productTitle: 'هدفون بی‌سیم نویز کنسلینگ پرو',
     sku: 'AUD-HP-PRO',
     barcode: '6260000009999',
     warehouse: 'انبار مرکزی تهران',
     currentQuantity: 0,
     reservedQuantity: 0,
     availableQuantity: 0,
     lowStockThreshold: 10,
     status: 'out_of_stock',
     thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80',
     lastRestockDate: '2026-02-10T08:00:00Z',
     updatedAt: '2026-07-30T11:00:00Z',
   },
   {
     id: 'inv-005',
     productId: 'prod-005',
     productTitle: 'پایه نگهدارنده مانیتور دوگانه',
     sku: 'ACC-MNT-DUAL',
     warehouse: 'انبار راکد',
     currentQuantity: 5,
     reservedQuantity: 0,
     availableQuantity: 5,
     lowStockThreshold: 5,
     status: 'archived',
     thumbnailUrl: 'https://images.unsplash.com/photo-1527443195645-1133f7f28990?w=100&q=80',
     updatedAt: '2026-01-05T10:00:00Z',
   }
 ];
 
 export class SellerInventoryService {
   /**
    * دریافت لیست تمام رکوردهای انبار فروشنده
    */
   static getAllInventory(): SellerInventoryModel[] {
     return MOCK_INVENTORY;
   }
 
   /**
    * دریافت رکوردهای انبار بر اساس وضعیت موجودی
    */
   static getInventoryByStatus(status: SellerStockStatus): SellerInventoryModel[] {
     return MOCK_INVENTORY.filter(inv => inv.status === status);
   }
 }