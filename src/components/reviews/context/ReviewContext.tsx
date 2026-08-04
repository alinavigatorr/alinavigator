'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Review, ReviewStats, ReviewSubmission } from '../../../domain/reviews/review-types';
import { ReviewService } from '../../../services/reviews/review-service';

interface ReviewContextState {
  reviews: Review[]; // لیست فیلتر شده برای نمایش
  stats: ReviewStats | null;
  isLoading: boolean;
  
  // فیلترها و مرتب‌سازی
  sortBy: string;
  filterBy: string;
  starFilter: string;
  withImagesFilter: boolean;
  isWritingReview: boolean;
  
  setSortBy: (sort: string) => void;
  setFilterBy: (filter: string) => void;
  setStarFilter: (filter: string) => void;
  setWithImagesFilter: (filter: boolean) => void;
  setIsWritingReview: (isWriting: boolean) => void;
  
  // اکشن‌ها
  fetchReviews: (productId: string) => Promise<void>;
  submitNewReview: (submission: ReviewSubmission) => Promise<void>;
  submitSellerReply: (reviewId: string, text: string) => Promise<void>;
  voteHelpful: (reviewId: string) => Promise<void>;
  voteUnhelpful: (reviewId: string) => Promise<void>;
  reportReview: (reviewId: string) => Promise<void>;
}

const ReviewContext = createContext<ReviewContextState | undefined>(undefined);

interface ReviewProviderProps {
  children: ReactNode;
  reviewService: ReviewService;
  productId: string;
}

export function ReviewProvider({ children, reviewService, productId }: ReviewProviderProps) {
  const [allReviews, setAllReviews] = useState<Review[]>([]); // کل نظرات دریافتی از سرور
  const [reviews, setReviews] = useState<Review[]>([]);       // نظرات فیلتر شده برای نمایش در UI
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [sortBy, setSortBy] = useState<string>('recent');
  const [filterBy, setFilterBy] = useState<string>('all');
  const [starFilter, setStarFilter] = useState<string>('all');
  const [withImagesFilter, setWithImagesFilter] = useState<boolean>(false);
  
  const [isWritingReview, setIsWritingReview] = useState<boolean>(false);

  const fetchReviews = async (id: string) => {
    setIsLoading(true);
    try {
      const statsData = await reviewService.getReviewStats(id);
      setStats(statsData);

      const reviewsResult = await reviewService.getReviewsByProduct(id);
      const reviewsData: Review[] = (reviewsResult as any).data || (Array.isArray(reviewsResult) ? reviewsResult : []);
      
      // در این فاز برای تست کردن وضعیت‌های مختلف نظارت (مثل در حال بررسی و مخفی)،
      // دیگر نظرات را محدود به approved نمی‌کنیم تا در UI نمایان شوند.
      setAllReviews(reviewsData);
    } catch (error) {
      console.error("[ReviewContext] Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // اعمال فیلترها و مرتب‌سازی به صورت کلاینت‌ساید
  useEffect(() => {
    let result = [...allReviews];

    // 1. فیلتر نوع خریدار
    if (filterBy === 'verified') {
      result = result.filter(r => r.isVerifiedPurchase);
    }

    // 2. فیلتر ستاره
    if (starFilter !== 'all') {
      result = result.filter(r => r.rating === parseInt(starFilter));
    }

    // 3. فیلتر عکس‌دار (پلیسهولدر - چون فیلد عکس نداریم فعلاً بی‌اثر است)
    if (withImagesFilter) {
      // result = result.filter(r => r.hasImages);
    }

    // 4. مرتب‌سازی
    if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'helpful') {
      result.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
    } else if (sortBy === 'highest') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => a.rating - b.rating);
    }

    setReviews(result);
  }, [allReviews, sortBy, filterBy, starFilter, withImagesFilter]);

  const submitNewReview = async (submission: ReviewSubmission) => {
    try {
      await reviewService.submitReview(submission);
      setIsWritingReview(false);
      if (productId) await fetchReviews(productId);
    } catch (error) {
      console.error("[ReviewContext] Failed to submit review:", error);
      throw error;
    }
  };

  const submitSellerReply = async (reviewId: string, text: string) => {
    try {
      setAllReviews(prev => prev.map(review => {
        if (review.id === reviewId) {
          return { ...review, sellerReply: { text, createdAt: new Date().toISOString() } };
        }
        return review;
      }));
    } catch (error) {
      console.error("[ReviewContext] Failed to submit seller reply:", error);
      throw error;
    }
  };

  // ==========================================
  // Placeholder Actions for Trust UX
  // ==========================================
  
  const voteHelpful = async (reviewId: string) => {
    // آپدیت آنی UI (بدون اتصال به بک‌اند واقعی در این فاز)
    setAllReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r));
  };

  const voteUnhelpful = async (reviewId: string) => {
    setAllReviews(prev => prev.map(r => r.id === reviewId ? { ...r, unhelpfulVotes: (r.unhelpfulVotes || 0) + 1 } : r));
  };

  const reportReview = async (reviewId: string) => {
    // تغییر وضعیت به گزارش شده (reported) تا کامپوننت UI حالت مخفی/گزارش را نشان دهد
    setAllReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'reported' } : r));
  };

  useEffect(() => {
    if (productId) {
      fetchReviews(productId);
    }
  }, [productId]);

  return (
    <ReviewContext.Provider value={{
      reviews,
      stats,
      isLoading,
      sortBy,
      filterBy,
      starFilter,
      withImagesFilter,
      isWritingReview,
      setSortBy,
      setFilterBy,
      setStarFilter,
      setWithImagesFilter,
      setIsWritingReview,
      fetchReviews,
      submitNewReview,
      submitSellerReply,
      voteHelpful,
      voteUnhelpful,
      reportReview
    }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviewContext() {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReviewContext must be used within a ReviewProvider');
  }
  return context;
}