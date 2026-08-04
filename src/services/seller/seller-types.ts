/**
 * Seller Platform Domain Types & Models
 * تعریف ساختار داده‌ای، وضعیت‌ها و مدل‌های مربوط به فروشندگان بازارچه (Marketplace Sellers).
 */

 export type SellerVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'suspended';

 export type SellerBusinessType = 'individual' | 'registered_company' | 'partnership' | 'manufacturer';
 
 export type StoreStatus = 'active' | 'inactive' | 'suspended' | 'vacation';
 
 export interface SellerRating {
   average: number; // بین 0 تا 5
   reviewCount: number;
   fulfillmentRate: number; // درصد ارسال به موقع
   responseRate: number; // درصد پاسخگویی به مشتریان
 }
 
 export interface SellerStatistics {
   productsCount: number;
   ordersCount: number;
   salesCount: number; // کل درآمد یا حجم فروش
   followersCount: number;
 }
 
 export interface SellerBusinessInfo {
   legalName: string;
   registrationNumber?: string;
   taxId?: string;
   supportEmail: string;
   supportPhone: string;
   address: {
     country: string;
     city: string;
     postalCode: string;
     street: string;
   };
 }
 
 export interface SellerModel {
   id: string;
   storeName: string;
   storeSlug: string;
   businessType: SellerBusinessType;
   verificationStatus: SellerVerificationStatus;
   storeStatus: StoreStatus;
   isPremium: boolean;
   joinDate: string; // ISO Date String
   rating: SellerRating;
   statistics: SellerStatistics;
   businessInfo: SellerBusinessInfo;
   avatarUrl: string;
   bannerUrl?: string;
 }