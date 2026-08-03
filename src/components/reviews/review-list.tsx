// src/components/reviews/review-list.tsx

import React from 'react';
import { Review } from '@/services/reviews/review-types';
import { ReviewCard } from './review-card';
import { ReviewEmptyState } from './review-empty-state';

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  // مدیریت حالت خالی (Empty State)
  if (!reviews || reviews.length === 0) {
    return (
      <div className="w-full py-8">
        <ReviewEmptyState />
      </div>
    );
  }

  // رندر لیست نظرات
  return (
    <div className="w-full flex flex-col gap-6">
      {reviews.map((review) => (
        <ReviewCard 
          key={review.id} 
          review={review} 
          // در فاز اتصال به API، نام واقعی کاربر جایگزین می‌شود
          username={`کاربر ${review.userId.slice(-4)}`} 
        />
      ))}
    </div>
  );
};