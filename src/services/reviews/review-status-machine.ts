// src/services/reviews/review-status-machine.ts

// تعریف چرخه حیات وضعیت‌های یک نظر بر اساس مانیفست
export type ReviewLifecycleStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PENDING_MODERATION'
  | 'APPROVED'
  | 'REJECTED'
  | 'HIDDEN'
  | 'SELLER_REPLIED';

export class ReviewStatusMachine {
  /**
   * گراف انتقال وضعیت‌ها (State Transitions Graph)
   * کلیدها: وضعیت فعلی
   * مقادیر: آرایه‌ای از وضعیت‌های مجازی که می‌توان به آن‌ها منتقل شد
   */
  private static allowedTransitions: Record<ReviewLifecycleStatus, ReviewLifecycleStatus[]> = {
    'DRAFT': ['SUBMITTED'],
    'SUBMITTED': ['PENDING_MODERATION', 'APPROVED', 'REJECTED'],
    'PENDING_MODERATION': ['APPROVED', 'REJECTED', 'HIDDEN'],
    'APPROVED': ['SELLER_REPLIED', 'HIDDEN'],
    'REJECTED': ['PENDING_MODERATION', 'HIDDEN'], // امکان بازبینی مجدد توسط عامل انسانی
    'HIDDEN': ['APPROVED', 'REJECTED'], // امکان بازگرداندن از حالت مخفی
    'SELLER_REPLIED': ['HIDDEN'] // نظری که پاسخ داده شده فقط می‌تواند مخفی شود
  };

  /**
   * بررسی می‌کند که آیا انتقال از وضعیت فعلی به وضعیت جدید مجاز است یا خیر.
   */
  static canTransition(currentStatus: ReviewLifecycleStatus, targetStatus: ReviewLifecycleStatus): boolean {
    if (currentStatus === targetStatus) {
      return true; // ماندن در وضعیت فعلی همیشه مجاز است
    }
    
    const possibleNextStates = this.allowedTransitions[currentStatus];
    return possibleNextStates ? possibleNextStates.includes(targetStatus) : false;
  }

  /**
   * دریافت تمام وضعیت‌های مجازی که می‌توان از وضعیت فعلی به آن‌ها حرکت کرد.
   */
  static getAvailableTransitions(currentStatus: ReviewLifecycleStatus): ReviewLifecycleStatus[] {
    return this.allowedTransitions[currentStatus] || [];
  }
}