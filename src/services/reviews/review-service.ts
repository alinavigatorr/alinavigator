import { Review, ReviewSubmission, ReviewStats, RatingDistribution } from '../../domain/reviews/review-types';
import { ReviewDataSource, DataSourceResult } from './review-data-source';

export class ReviewService {
  private dataSource: ReviewDataSource;

  /**
   * Dependency Injection: 
   * سرویس وابسته به پیاده‌سازی خاصی نیست و فقط اینترفیس را می‌شناسد.
   */
  constructor(dataSource: ReviewDataSource) {
    this.dataSource = dataSource;
  }

  async getReviewsByProduct(productId: string): Promise<DataSourceResult<Review[]>> {
    return this.dataSource.getReviewsByProduct(productId);
  }

  async getReviewById(reviewId: string): Promise<DataSourceResult<Review>> {
    return this.dataSource.getReviewById(reviewId);
  }

  async submitReview(submission: ReviewSubmission): Promise<DataSourceResult<Review>> {
    // Note: در فازهای آینده، ReviewValidator و ReviewModeration 
    // قبل از پاس دادن داده به Data Source در اینجا فراخوانی خواهند شد.
    return this.dataSource.submitReview(submission);
  }

  async updateReview(reviewId: string, updates: Partial<ReviewSubmission>): Promise<DataSourceResult<Review>> {
    return this.dataSource.updateReview(reviewId, updates);
  }

  async deleteReview(reviewId: string): Promise<DataSourceResult<boolean>> {
    return this.dataSource.deleteReview(reviewId);
  }

  /**
   * متد جدید اضافه شده برای فاز ۱ اسپرینت ۳۰:
   * محاسبه آمار نظرات (میانگین، تعداد و توزیع ستاره‌ها) بر اساس داده‌های دیتاسورس
   */
  async getReviewStats(productId: string): Promise<ReviewStats> {
    const result = await this.dataSource.getReviewsByProduct(productId);
    
    // استخراج آرایه نظرات با توجه به ساختار DataSourceResult شما
    const reviews: Review[] = (result as any).data || (Array.isArray(result) ? result : []);
    
    const distribution: RatingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalScore = 0;
    let approvedCount = 0;

    reviews.forEach(review => {
      if (review.status === 'approved') {
        const rating = Math.round(review.rating) as keyof RatingDistribution;
        if (distribution[rating] !== undefined) {
          distribution[rating] += 1;
        }
        totalScore += review.rating;
        approvedCount++;
      }
    });

    const averageRating = approvedCount > 0 ? Number((totalScore / approvedCount).toFixed(1)) : 0;

    return {
      averageRating,
      totalReviews: approvedCount,
      distribution
    };
  }
}