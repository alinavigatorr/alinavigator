// src/services/reviews/review-engine.ts

import { Review, ReviewSubmission, ReviewValidationResult } from './review-types';
import { ReviewValidator } from './review-validator';
import { ReviewRatingCalculator } from './review-rating';

export class ReviewEngine {
  /**
   * بررسی می‌کند که آیا فرم نظر کاربر معتبر است یا خیر
   */
  static validateSubmission(submission: Partial<ReviewSubmission>): ReviewValidationResult {
    return ReviewValidator.validateSubmission(submission);
  }

  /**
   * تشخیص نظر تکراری: آیا این کاربر قبلاً برای این محصول نظری ثبت کرده است؟
   */
  static isDuplicateReview(userId: string, productId: string, existingReviews: Review[]): boolean {
    return existingReviews.some(
      (review) => review.userId === userId && review.productId === productId
    );
  }

  /**
   * بررسی نهایی برای ثبت نظر: نظر باید معتبر باشد و تکراری نباشد
   */
  static canSubmitReview(
    submission: Partial<ReviewSubmission>,
    existingReviews: Review[]
  ): ReviewValidationResult {
    const validation = this.validateSubmission(submission);
    
    if (!validation.isValid) {
      return validation;
    }

    if (submission.userId && submission.productId) {
      const isDuplicate = this.isDuplicateReview(submission.userId, submission.productId, existingReviews);
      if (isDuplicate) {
        return {
          isValid: false,
          errors: ['شما قبلاً برای این محصول نظر ثبت کرده‌اید.']
        };
      }
    }

    return { isValid: true, errors: [] };
  }

  /**
   * آیا فروشنده اجازه ثبت پاسخ برای این نظر را دارد؟
   * قوانین: نظر باید تأیید شده (APPROVED) باشد و از قبل پاسخی نداشته باشد.
   */
  static canSellerReply(review: Review): boolean {
    return review.status === 'APPROVED' && (!review.sellerReply || review.sellerReply === null);
  }

  /**
   * آیا خریدار این محصول را واقعاً خریده است؟
   */
  static isVerifiedPurchase(review: Review): boolean {
    return review.isVerifiedPurchase === true;
  }

  /**
   * دریافت وضعیت فعلی نظر
   */
  static getReviewStatus(review: Review): string {
    return review.status;
  }

  // ==========================================
  // RATINGS FACADE
  // ==========================================

  static calculateAverageRating(reviews: Review[]): number {
    return ReviewRatingCalculator.calculateAverage(reviews);
  }

  static calculateRatingDistribution(reviews: Review[]): Record<number, number> {
    return ReviewRatingCalculator.calculateDistribution(reviews);
  }
}