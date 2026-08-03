/**
 * Seller Order Service
 * لایه سرویس برای مدیریت سفارشات فروشنده (Mock Data for Sprint 29)
 */

 import { SellerOrderModel, SellerOrderStatus } from './seller-order-types';

 const MOCK_SELLER_ORDERS: SellerOrderModel[] = [
   {
     id: 'ord-1001',
     orderNumber: 'ORD-982374-A',
     orderDate: '2026-08-01T08:30:00Z',
     totalAmount: 35000000,
     status: 'pending',
     paymentStatus: 'pending',
     customer: {
       name: 'علی حسینی',
       phone: '09123456789',
       city: 'تهران'
     },
     products: [
       { productId: 'prod-001', title: 'گوشی موبایل هوشمند مدل X', quantity: 1, unitPrice: 25000000, thumbnailUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&q=80' },
       { productId: 'prod-015', title: 'هدفون بلوتوثی اسپرت', quantity: 1, unitPrice: 10000000, thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80' }
     ]
   },
   {
     id: 'ord-1002',
     orderNumber: 'ORD-982375-B',
     orderDate: '2026-07-31T14:15:00Z',
     totalAmount: 8500000,
     status: 'preparing',
     paymentStatus: 'paid',
     customer: {
       name: 'سارا رضایی',
       city: 'اصفهان'
     },
     products: [
       { productId: 'prod-002', title: 'هدفون بی‌سیم نویز کنسلینگ پرو', quantity: 1, unitPrice: 8500000, thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80' }
     ]
   },
   {
     id: 'ord-1003',
     orderNumber: 'ORD-982376-C',
     orderDate: '2026-07-28T09:00:00Z',
     totalAmount: 12000000,
     status: 'shipped',
     paymentStatus: 'paid',
     shipmentTrackingCode: 'IR-POST-88392011',
     customer: {
       name: 'محمد کریمی',
       city: 'شیراز'
     },
     products: [
       { productId: 'prod-003', title: 'ساعت هوشمند اسپرت سری ۷', quantity: 1, unitPrice: 12000000, thumbnailUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&q=80' }
     ]
   },
   {
     id: 'ord-1004',
     orderNumber: 'ORD-982377-D',
     orderDate: '2026-07-25T11:45:00Z',
     totalAmount: 4500000,
     status: 'delivered',
     paymentStatus: 'paid',
     shipmentTrackingCode: 'IR-POST-99482012',
     customer: {
       name: 'رضا طاهری',
       city: 'مشهد'
     },
     products: [
       { productId: 'prod-004', title: 'کیبورد مکانیکال گیمینگ RGB', quantity: 1, unitPrice: 4500000, thumbnailUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=100&q=80' }
     ]
   },
   {
     id: 'ord-1005',
     orderNumber: 'ORD-982378-E',
     orderDate: '2026-07-20T16:20:00Z',
     totalAmount: 2800000,
     status: 'refunded',
     paymentStatus: 'refunded',
     customer: {
       name: 'نگین مرادی',
       city: 'تبریز'
     },
     products: [
       { productId: 'prod-005', title: 'پایه نگهدارنده مانیتور دوگانه', quantity: 1, unitPrice: 2800000, thumbnailUrl: 'https://images.unsplash.com/photo-1527443195645-1133f7f28990?w=100&q=80' }
     ]
   }
 ];
 
 export class SellerOrderService {
   /**
    * دریافت لیست تمام سفارشات فروشنده
    */
   static getAllOrders(): SellerOrderModel[] {
     return MOCK_SELLER_ORDERS;
   }
 
   /**
    * دریافت سفارشات بر اساس وضعیت سفارش
    */
   static getOrdersByStatus(status: SellerOrderStatus): SellerOrderModel[] {
     return MOCK_SELLER_ORDERS.filter(o => o.status === status);
   }
 }