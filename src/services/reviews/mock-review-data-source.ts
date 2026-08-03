// src/services/reviews/mock-review-data-source.ts

import { Review, ReviewSubmission } from './review-types';
import { ReviewDataSource, DataSourceResult } from './review-data-source';

export class MockReviewDataSource implements ReviewDataSource {
  // In-memory mock database
  private reviews: Review[] = [
    {
      id: '1',
      productId: 'p1',
      userId: 'user-123',
      rating: 5,
      title: 'کیفیت ساخت عالی',
      body: 'دقیقا همون چیزی بود که انتظار داشتم. متریال فوق‌العاده با کیفیته.',
      status: 'APPROVED',
      isVerifiedPurchase: true,
      score: 14,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      productId: 'p1',
      userId: 'user-456',
      rating: 4,
      title: 'خوب و کاربردی',
      body: 'طراحی خوبی داره فقط ای کاش کابلش کمی بلندتر بود.',
      status: 'APPROVED',
      isVerifiedPurchase: true,
      score: 2,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // روز گذشته
      sellerReply: {
        text: 'ممنون از نظر شما، پیشنهاد شما به تیم طراحی ارجاع داده شد.',
        repliedAt: new Date().toISOString(),
        sellerId: 'seller-1'
      }
    }
  ];

  // Simulate network latency (500ms)
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getReviewsByProduct(productId: string): Promise<DataSourceResult<Review[]>> {
    await this.delay();
    const productReviews = this.reviews.filter(r => r.productId === productId);
    return { success: true, data: productReviews };
  }

  async getReviewById(reviewId: string): Promise<DataSourceResult<Review>> {
    await this.delay();
    const review = this.reviews.find(r => r.id === reviewId);
    if (!review) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'نظر پیدا نشد' } };
    }
    return { success: true, data: review };
  }

  async submitReview(submission: ReviewSubmission): Promise<DataSourceResult<Review>> {
    await this.delay();
    const newReview: Review = {
      id: `mock-${Date.now()}`,
      productId: submission.productId,
      userId: submission.userId || 'guest-user',
      rating: submission.rating,
      title: submission.title || '',
      body: submission.body,
      status: 'SUBMITTED', 
      isVerifiedPurchase: false,
      score: 0,
      createdAt: new Date().toISOString(),
    };
    this.reviews.push(newReview);
    return { success: true, data: newReview };
  }

  async updateReview(reviewId: string, updates: Partial<ReviewSubmission>): Promise<DataSourceResult<Review>> {
    await this.delay();
    const index = this.reviews.findIndex(r => r.id === reviewId);
    if (index === -1) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'نظر برای ویرایش پیدا نشد' } };
    }
    
    // شبیه‌سازی آپدیت
    const updatedReview = { ...this.reviews[index], ...updates };
    this.reviews[index] = updatedReview;
    return { success: true, data: updatedReview };
  }

  async deleteReview(reviewId: string): Promise<DataSourceResult<boolean>> {
    await this.delay();
    const initialLength = this.reviews.length;
    this.reviews = this.reviews.filter(r => r.id !== reviewId);
    
    if (this.reviews.length === initialLength) {
       return { success: false, error: { code: 'NOT_FOUND', message: 'نظر برای حذف پیدا نشد' } };
    }
    return { success: true, data: true };
  }
}