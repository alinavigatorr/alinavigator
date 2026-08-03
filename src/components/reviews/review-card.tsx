// src/components/reviews/review-card.tsx

import React from 'react';
import { Star, CheckCircle, User, CornerDownRight } from 'lucide-react';
import { Review } from '@/services/reviews/review-types';

interface ReviewCardProps {
  review: Review;
  // برای حالت UI به صورت پیش‌فرض یک نام مستعار می‌پذیریم
  username?: string; 
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, username = 'کاربر مهمان' }) => {
  // قالب‌بندی تاریخ به صورت نمایشی
  const formattedDate = new Date(review.createdAt).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 hover:bg-white/[0.07] group">
      {/* Header: User Info & Rating */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar Placeholder */}
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5 transition-transform duration-300 group-hover:scale-105">
            <User className="w-6 h-6 text-white/60" aria-hidden="true" />
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">{username}</span>
              {review.isVerifiedPurchase && (
                <span 
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white/90 text-xs font-medium border border-white/10"
                  title="خریدار تایید شده"
                >
                  <CheckCircle className="w-3 h-3" aria-hidden="true" />
                  <span className="hidden sm:inline">خریدار</span>
                </span>
              )}
            </div>
            <time dateTime={review.createdAt} className="text-sm text-white/40 mt-1">
              {formattedDate}
            </time>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1" aria-label={`امتیاز ${review.rating} از ۵`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= review.rating 
                  ? 'text-white fill-white' 
                  : 'text-white/20 fill-transparent'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Review Content */}
      <div className="space-y-3">
        <h4 className="text-lg font-bold text-white">{review.title}</h4>
        <p className="text-white/70 leading-relaxed text-sm sm:text-base">
          {review.body}
        </p>
      </div>

      {/* Seller Reply Placeholder */}
      {review.sellerReply && (
        <div className="mt-6 flex gap-3">
          <CornerDownRight className="w-5 h-5 text-white/30 shrink-0 mt-3" aria-hidden="true" />
          <div className="flex-1 p-5 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden transition-colors duration-300 hover:bg-white/10">
            <div className="absolute top-0 right-0 w-1 h-full bg-white/20 rounded-r-2xl" />
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-white text-sm">پاسخ فروشنده</span>
              <span className="text-xs text-white/40">
                {new Date(review.sellerReply.repliedAt).toLocaleDateString('fa-IR')}
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              {review.sellerReply.text}
            </p>
          </div>
        </div>
      )}
    </article>
  );
};