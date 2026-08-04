/**
 * Seller Profile Management Service
 * سرویس مدیریت و بازیابی پروفایل‌های جامع فروشندگان.
 */

 import { SellerProfileModel } from './seller-profile-types';

 export const MOCK_SELLER_PROFILES: SellerProfileModel[] = [
   {
     sellerId: 'seller-tech-hub',
     storeName: 'تک هاب (TechHub)',
     storeSlug: 'tech-hub',
     companyName: 'شرکت فناوری اطلاعات تک هاب پیشرو',
     businessType: 'registered_company',
     registrationNumber: '1400895623',
     taxInfo: {
       taxId: '411009876543',
       vatNumber: 'VAT-99887766',
       isVatRegistered: true,
     },
     verificationStatus: 'verified',
     storeStatus: 'active',
     contact: {
       phone: '021-88887777',
       email: 'admin@techhub.local',
       supportEmail: 'support@techhub.local',
     },
     businessAddress: {
       country: 'ایران',
       state: 'تهران',
       city: 'تهران',
       postalCode: '1587512345',
       street: 'خیابان ولیعصر، تقاطع مطهری',
       unit: 'طبقه ۴، واحد ۱۲',
     },
     shippingAddress: {
       country: 'ایران',
       state: 'تهران',
       city: 'تهران',
       postalCode: '1587512345',
       street: 'انبار مرکزی تک هاب، شهرک صنعتی پایتخت',
     },
     bankAccount: {
       bankName: 'بانک سامان',
       accountHolderName: 'شرکت فناوری اطلاعات تک هاب پیشرو',
       accountNumber: '880123456789',
       shebaNumber: 'IR560660000000880123456789',
       routingNumber: 'SAMAN-IR-TH',
     },
     branding: {
       logoUrl: 'https://ui-avatars.com/api/?name=Tech+Hub&background=4F46E5&color=fff',
       bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
       description: 'مرجع تخصصی تامین و عرضه قطعات سخت‌افزاری، تجهیزات شبکه و لوازم جانبی دیجیتال با ضمانت اصالت کالا.',
       shortBio: 'پیشرو در فناوری و تجهیزات دیجیتال',
       website: 'https://techhub.local',
     },
     rating: {
       average: 4.8,
       reviewCount: 1250,
       fulfillmentRate: 99.2,
       responseRate: 98.5,
     },
     createdAt: '2024-03-15T10:00:00Z',
     updatedAt: '2026-01-10T12:00:00Z',
   },
   {
     sellerId: 'seller-modern-home',
     storeName: 'خانه مدرن (Modern Home)',
     storeSlug: 'modern-home',
     companyName: 'فروشگاه لوازم خانگی مدرن',
     businessType: 'partnership',
     registrationNumber: '1400983214',
     taxInfo: {
       taxId: '411887766554',
       isVatRegistered: false,
     },
     verificationStatus: 'verified',
     storeStatus: 'active',
     contact: {
       phone: '021-44445555',
       email: 'admin@modernhome.local',
       supportEmail: 'support@modernhome.local',
     },
     businessAddress: {
       country: 'ایران',
       state: 'تهران',
       city: 'تهران',
       postalCode: '1997934567',
       street: 'خیابان شریعتی، بالاتر از پل صدر',
     },
     shippingAddress: {
       country: 'ایران',
       state: 'تهران',
       city: 'تهران',
       postalCode: '1997934567',
       street: 'انبار فروشگاه مدرن، خیابان شریعتی',
     },
     bankAccount: {
       bankName: 'بانک پاسارگاد',
       accountHolderName: 'فروشگاه لوازم خانگی مدرن',
       accountNumber: '990987654321',
       shebaNumber: 'IR210570000000990987654321',
     },
     branding: {
       logoUrl: 'https://ui-avatars.com/api/?name=Modern+Home&background=10B981&color=fff',
       description: 'عرضه مستقیم لوازم لوکس و مدرن منزل، دکوراسیون داخلی و آشپزخانه.',
       shortBio: 'زیبایی و مدرنیته برای خانه شما',
     },
     rating: {
       average: 4.5,
       reviewCount: 410,
       fulfillmentRate: 96.5,
       responseRate: 92.0,
     },
     createdAt: '2024-07-20T14:30:00Z',
     updatedAt: '2026-02-01T09:15:00Z',
   },
 ];
 
 export class SellerProfileService {
   /**
    * دریافت لیست تمام پروفایل‌های فروشندگان
    */
   static getAllProfiles(): SellerProfileModel[] {
     return MOCK_SELLER_PROFILES;
   }
 
   /**
    * دریافت پروفایل فروشنده بر اساس شناسه فروشنده
    */
   static getProfileBySellerId(sellerId: string): SellerProfileModel | null {
     return MOCK_SELLER_PROFILES.find((p) => p.sellerId === sellerId) || null;
   }
 
   /**
    * دریافت پروفایل فروشنده بر اساس اسلاگ فروشگاه
    */
   static getProfileBySlug(slug: string): SellerProfileModel | null {
     return MOCK_SELLER_PROFILES.find((p) => p.storeSlug === slug) || null;
   }
 }