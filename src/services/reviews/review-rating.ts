// src/services/reviews/review-rating.ts

import { Review } from './review-types';

export class ReviewRatingCalculator {
  /**
   * محاسبه میانگین امتیازات یک لیست از نظرات
   */
  static calculateAverage(reviews: Review[]): number {
    if (!reviews || reviews.length === 0) return 0;
    
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;
    
    // گرد کردن به یک رقم اعشار (مثلاً 4.3)
    return Math.round(average * 10) / 10;
  }

  /**
   * محاسبه توزیع امتیازات (تعداد نظرات برای هر ستاره از ۱ تا ۵)
   */
  static calculateDistribution(reviews: Review[]): Record<number, number> {
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    if (!reviews || reviews.length === 0) return distribution;

    reviews.forEach(review => {
      // اطمینان از اینکه امتیاز در محدوده صحیح و عدد صحیح است
      const rating = Math.floor(review.rating);
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
      }
    });

    return distribution;
  }
}