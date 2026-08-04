/**
 * Seller Profile Domain Types & Models
 * تعریف مدل‌ها و ساختارهای داده‌ای جامع مربوط به پروفایل فروشنده (بانکی، مالیاتی، آدرس‌ها و برندینگ).
 */

 import { SellerBusinessType, SellerVerificationStatus, StoreStatus, SellerRating } from './seller-types';

 export interface SellerAddressModel {
   country: string;
   state: string;
   city: string;
   postalCode: string;
   street: string;
   unit?: string;
 }
 
 export interface SellerBankInfo {
   bankName: string;
   accountHolderName: string;
   accountNumber: string;
   shebaNumber: string; // IBAN / Sheba for regional banking
   routingNumber?: string;
 }
 
 export interface SellerTaxInfo {
   taxId: string;
   vatNumber?: string;
   isVatRegistered: boolean;
 }
 
 export interface SellerBrandingModel {
   logoUrl: string;
   bannerUrl?: string;
   description: string;
   shortBio?: string;
   website?: string;
 }
 
 export interface SellerProfileModel {
   sellerId: string;
   storeName: string;
   storeSlug: string;
   companyName: string;
   businessType: SellerBusinessType;
   registrationNumber: string;
   taxInfo: SellerTaxInfo;
   verificationStatus: SellerVerificationStatus;
   storeStatus: StoreStatus;
   contact: {
     phone: string;
     email: string;
     supportEmail: string;
   };
   businessAddress: SellerAddressModel;
   shippingAddress: SellerAddressModel;
   bankAccount: SellerBankInfo;
   branding: SellerBrandingModel;
   rating: SellerRating;
   createdAt: string; // ISO Date String
   updatedAt: string; // ISO Date String
 }