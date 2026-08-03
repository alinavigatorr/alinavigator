// src/services/reviews/review-reply-policy.ts

export const SellerReplyPolicy = {
  rules: {
    text: {
      minLength: 10,
      maxLength: 1500,
    },
    constraints: {
      // فقط یک پاسخ رسمی از سمت فروشنده مجاز است
      allowSingleOfficialReply: true,
      // آیا فروشنده می‌تواند پاسخ خود را ویرایش کند؟
      isEditable: true,
      // محدودیت زمانی برای ویرایش پاسخ (به ساعت) - 0 یعنی بدون محدودیت
      editableTimeWindowHours: 72,
    }
  }
} as const;