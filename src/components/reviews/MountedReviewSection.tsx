'use client';

import React, { useMemo } from 'react';
import { ReviewProvider } from './context/ReviewContext';
import { ReviewPresentationLayer } from './presentation/ReviewPresentationLayer';
import { ReviewService } from '../../services/reviews/review-service';

// 🔴 تغییر در این خط: به جای اینترفیس، کلاس اصلی را ایمپورت کنید
import { MockReviewDataSource } from '../../services/reviews/review-data-source'; 

interface MountedReviewSectionProps {
  productId: string;
}

export default function MountedReviewSection({ productId }: MountedReviewSectionProps) {
  const reviewService = useMemo(() => {
    // 🔴 تغییر در این خط: کلاس پیاده‌سازی شده را new کنید
    const dataSource = new MockReviewDataSource(); 
    return new ReviewService(dataSource);      
  }, []);

  return (
    <ReviewProvider reviewService={reviewService} productId={productId}>
      <ReviewPresentationLayer />
    </ReviewProvider>
  );
}