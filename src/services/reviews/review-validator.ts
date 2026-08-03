// src/services/reviews/review-validator.ts

import { ReviewSubmission, ReviewValidationResult } from './review-types';
import { ReviewPolicy } from './review-policy';

export class ReviewValidator {
  /**
   * بررسی می‌کند که آیا داده‌های ارسال شده برای یک نظر معتبر هستند یا خیر.
   */
  static validateSubmission(submission: Partial<ReviewSubmission>): ReviewValidationResult {
    const errors: string[] = [];
    const { rules } = ReviewPolicy;

    // Rating Validation
    if (submission.rating === undefined || submission.rating === null) {
      errors.push('Rating is required.');
    } else if (submission.rating < rules.rating.min || submission.rating > rules.rating.max) {
      errors.push(`Rating must be between ${rules.rating.min} and ${rules.rating.max}.`);
    }

    // Title Validation
    if (!submission.title || submission.title.trim() === '') {
      errors.push('Review title is required.');
    } else {
      const titleLength = submission.title.trim().length;
      if (titleLength < rules.title.minLength) {
        errors.push(`Review title must be at least ${rules.title.minLength} characters long.`);
      }
      if (titleLength > rules.title.maxLength) {
        errors.push(`Review title must not exceed ${rules.title.maxLength} characters.`);
      }
    }

    // Body Validation
    if (!submission.body || submission.body.trim() === '') {
      errors.push('Review body is required.');
    } else {
      const bodyLength = submission.body.trim().length;
      if (bodyLength < rules.body.minLength) {
        errors.push(`Review body must be at least ${rules.body.minLength} characters long.`);
      }
      if (bodyLength > rules.body.maxLength) {
        errors.push(`Review body must not exceed ${rules.body.maxLength} characters.`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}