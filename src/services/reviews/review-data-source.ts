// src/services/reviews/review-data-source.ts

import { Review, ReviewSubmission } from '../../domain/reviews/review-types';

export interface DataSourceResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface ReviewDataSource {
  getReviewsByProduct(productId: string): Promise<DataSourceResult<Review[]>>;
  getReviewById(reviewId: string): Promise<DataSourceResult<Review>>;
  submitReview(submission: ReviewSubmission): Promise<DataSourceResult<Review>>;
  updateReview(reviewId: string, updates: Partial<ReviewSubmission>): Promise<DataSourceResult<Review>>;
  deleteReview(reviewId: string): Promise<DataSourceResult<boolean>>;
}

// ============================================================================
// کلاس تستی (Mock) با داده‌های جدید برای تست نشان‌های اعتماد و وضعیت‌های نظارت
// ============================================================================

export class MockReviewDataSource implements ReviewDataSource {
  private mockReviews: Review[] = [
    {
      id: 'rev-1',
      productId: 'prod-001', 
      author: { name: 'علی احمدی', isAnonymous: false, isTopReviewer: true }, // Top Reviewer!
      rating: 5,
      title: 'فوق‌العاده بود!',
      comment: 'کیفیت ساخت بسیار بالاست و دقیقا همون چیزی بود که انتظار داشتم. بسته بندی هم خیلی عالی بود.',
      pros: ['طراحی زیبا', 'کیفیت ساخت عالی'],
      cons: [],
      isVerifiedPurchase: true,
      isRecommended: true, // Recommended!
      status: 'approved',
      helpfulVotes: 124,
      unhelpfulVotes: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: 'rev-2',
      productId: 'prod-001',
      author: { name: 'کاربر ناشناس', isAnonymous: true },
      rating: 2,
      title: 'خوب ولی کمی گران',
      comment: 'محصول خوبیه ولی به نظرم ارزش خرید با این قیمت رو نداره. اگر تو تخفیف باشه عالیه.',
      pros: [],
      cons: ['قیمت بالا'],
      isVerifiedPurchase: true,
      isRecommended: false,
      status: 'approved',
      helpfulVotes: 5,
      unhelpfulVotes: 12,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      sellerReply: {
        text: 'مشتری عزیز، از بازخورد شما سپاسگزاریم. تلاش ما ارائه بالاترین کیفیت ممکن است.',
        createdAt: new Date(Date.now() - 40000000).toISOString()
      }
    },
    {
      id: 'rev-3',
      productId: 'prod-001',
      author: { name: 'رضا حسینی', isAnonymous: false },
      rating: 4,
      title: 'در حال بررسی...',
      comment: 'محصول خیلی خوبی بود فقط ارسالش یکم طول کشید. در کل راضیم.',
      isVerifiedPurchase: true,
      isRecommended: true,
      status: 'pending', // وضعیت: در انتظار تایید
      helpfulVotes: 0,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'rev-4',
      productId: 'prod-001',
      author: { name: 'کاربر مسدود', isAnonymous: true },
      rating: 1,
      comment: 'محتوای نامناسب که توسط سیستم مخفی شده است.',
      isVerifiedPurchase: false,
      status: 'hidden', // وضعیت: مخفی شده / گزارش شده
      helpfulVotes: 0,
      createdAt: new Date(Date.now() - 500000000).toISOString()
    }
  ];

  async getReviewsByProduct(productId: string): Promise<DataSourceResult<Review[]>> {
    return { success: true, data: this.mockReviews };
  }
  
  async getReviewById(reviewId: string): Promise<DataSourceResult<Review>> {
    const review = this.mockReviews.find(r => r.id === reviewId);
    return { success: !!review, data: review };
  }
  
  async submitReview(submission: ReviewSubmission): Promise<DataSourceResult<Review>> {
    const newReview: Review = {
      ...submission,
      id: `rev-${Date.now()}`,
      status: 'pending', // نظرات جدید به صورت pending ثبت می‌شوند
      helpfulVotes: 0,
      unhelpfulVotes: 0,
      createdAt: new Date().toISOString()
    };
    this.mockReviews.unshift(newReview);
    return { success: true, data: newReview };
  }
  
  async updateReview(reviewId: string, updates: Partial<ReviewSubmission>): Promise<DataSourceResult<Review>> {
    return { success: true, data: this.mockReviews[0] };
  }
  
  async deleteReview(reviewId: string): Promise<DataSourceResult<boolean>> {
    return { success: true, data: true };
  }
}