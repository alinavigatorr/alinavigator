/**
 * Seller Platform Repository
 * لایه مدیریت و دسترسی به اطلاعات فروشندگان تستی در سیستم.
 */

 import { SellerModel, SellerVerificationStatus } from './seller-types';

 export const MOCK_SELLERS: SellerModel[] = [
   {
     id: 'seller-tech-hub',
     storeName: 'تک هاب (TechHub)',
     storeSlug: 'tech-hub',
     businessType: 'registered_company',
     verificationStatus: 'verified',
     storeStatus: 'active',
     isPremium: true,
     joinDate: '2024-03-15T10:00:00Z',
     rating: {
       average: 4.8,
       reviewCount: 1250,
       fulfillmentRate: 99.2,
       responseRate: 98.5,
     },
     statistics: {
       productsCount: 142,
       ordersCount: 3890,
       salesCount: 450000000,
       followersCount: 5200,
     },
     businessInfo: {
       legalName: 'شرکت فناوری اطلاعات تک هاب پیشرو',
       registrationNumber: '1400895623',
       taxId: '411009876543',
       supportEmail: 'support@techhub.local',
       supportPhone: '021-88887777',
       address: {
         country: 'ایران',
         city: 'تهران',
         postalCode: '1587512345',
         street: 'خیابان ولیعصر، تقاطع مطهری',
       },
     },
     avatarUrl: 'https://ui-avatars.com/api/?name=Tech+Hub&background=4F46E5&color=fff',
     bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
   },
   {
     id: 'seller-modern-home',
     storeName: 'خانه مدرن (Modern Home)',
     storeSlug: 'modern-home',
     businessType: 'partnership',
     verificationStatus: 'verified',
     storeStatus: 'active',
     isPremium: false,
     joinDate: '2024-07-20T14:30:00Z',
     rating: {
       average: 4.5,
       reviewCount: 410,
       fulfillmentRate: 96.5,
       responseRate: 92.0,
     },
     statistics: {
       productsCount: 85,
       ordersCount: 920,
       salesCount: 120000000,
       followersCount: 1840,
     },
     businessInfo: {
       legalName: 'فروشگاه لوازم خانگی مدرن',
       registrationNumber: '1400983214',
       taxId: '411887766554',
       supportEmail: 'support@modernhome.local',
       supportPhone: '021-44445555',
       address: {
         country: 'ایران',
         city: 'تهران',
         postalCode: '1997934567',
         street: 'خیابان شریعتی، بالاتر از پل صدر',
       },
     },
     avatarUrl: 'https://ui-avatars.com/api/?name=Modern+Home&background=10B981&color=fff',
   },
 ];
 
 export class SellerRepository {
   /**
    * دریافت لیست تمام فروشندگان
    */
   static getAllSellers(): SellerModel[] {
     return MOCK_SELLERS;
   }
 
   /**
    * یافتن فروشنده بر اساس شناسه (ID)
    */
   static getSellerById(id: string): SellerModel | null {
     return MOCK_SELLERS.find((s) => s.id === id) || null;
   }
 
   /**
    * یافتن فروشنده بر اساس اسلاگ فروشگاه
    */
   static getSellerBySlug(slug: string): SellerModel | null {
     return MOCK_SELLERS.find((s) => s.storeSlug === slug) || null;
   }
 
   /**
    * دریافت فروشندگان بر اساس وضعیت تایید
    */
   static getSellersByStatus(status: SellerVerificationStatus): SellerModel[] {
     return MOCK_SELLERS.filter((s) => s.verificationStatus === status);
   }
 }