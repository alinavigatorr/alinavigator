/**
 * Review Domain Types
 * Defines the core data structures for the Reviews feature.
 */

// وضعیت‌های جدید برای سیستم مانیتورینگ و نظارت اضافه شد
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'hidden' | 'reported';

export interface RatingDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistribution;
}

export interface ReviewAuthor {
  name: string;
  isAnonymous: boolean;
  isTopReviewer?: boolean; // سیگنال اعتماد: خریدار با نظرات زیاد و مفید
}

export interface SellerReply {
  text: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  author: ReviewAuthor;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  pros?: string[]; 
  cons?: string[]; 
  isVerifiedPurchase: boolean;
  isRecommended?: boolean; // سیگنال اعتماد: آیا کاربر خرید این محصول را پیشنهاد می‌دهد؟
  status: ReviewStatus;
  helpfulVotes: number;
  unhelpfulVotes?: number; // اضافه شده برای دکمه 'مفید نبود'
  createdAt: string; // ISO Date String
  sellerReply?: SellerReply;
}

// تایپ داده‌های ارسالی فرم کاربر (بدون فیلدهای سیستمی)
export type ReviewSubmission = Omit<Review, 'id' | 'status' | 'helpfulVotes' | 'unhelpfulVotes' | 'createdAt' | 'sellerReply'>;