// src/contexts/ReviewContext.tsx

'use client';

import React, { createContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { Review, ReviewSubmission } from '@/services/reviews/review-types';
// فرض بر این است که reviewService در فاز دوم (یا توسط شما) ایجاد شده و آماده سرویس‌دهی است
import { reviewService } from '@/services/reviews/review-service'; 

interface ReviewContextState {
  reviews: Review[];
  selectedReview: Review | null;
  loading: boolean;
  error: string | null;
  pending: boolean;
}

interface ReviewContextActions {
  loadReviews: (productId: string) => Promise<void>;
  createReview: (submission: ReviewSubmission) => Promise<boolean>;
  updateReview: (reviewId: string, updates: Partial<ReviewSubmission>) => Promise<boolean>;
  deleteReview: (reviewId: string) => Promise<boolean>;
  refreshReviews: (productId: string) => Promise<void>;
  clearSelection: () => void;
}

export const ReviewContext = createContext<(ReviewContextState & ReviewContextActions) | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);

  const loadReviews = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reviewService.getReviewsByProduct(productId);
      if (result.success && result.data) {
        setReviews(result.data);
      } else {
        setError(result.error?.message || 'خطا در دریافت نظرات');
      }
    } catch (err: any) {
      setError(err?.message || 'خطای غیرمنتظره در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshReviews = useCallback(async (productId: string) => {
    // رفرش کردن در پس‌زمینه بدون نمایش لودینگ اصلی
    try {
      const result = await reviewService.getReviewsByProduct(productId);
      if (result.success && result.data) {
        setReviews(result.data);
      }
    } catch (err) {
      console.error('Failed to refresh reviews:', err);
    }
  }, []);

  const createReview = useCallback(async (submission: ReviewSubmission): Promise<boolean> => {
    setPending(true);
    setError(null);
    try {
      const result = await reviewService.submitReview(submission);
      if (result.success) {
        // پس از ثبت موفق، نظرات را رفرش می‌کنیم
        await refreshReviews(submission.productId);
        return true;
      } else {
        setError(result.error?.message || 'خطا در ثبت نظر');
        return false;
      }
    } catch (err: any) {
      setError(err?.message || 'خطای غیرمنتظره در ثبت نظر');
      return false;
    } finally {
      setPending(false);
    }
  }, [refreshReviews]);

  const updateReview = useCallback(async (reviewId: string, updates: Partial<ReviewSubmission>): Promise<boolean> => {
    setPending(true);
    setError(null);
    try {
      const result = await reviewService.updateReview(reviewId, updates);
      if (result.success) {
        // آپدیت کردن لیست در استیت محلی جهت پرفورمنس بالاتر
        setReviews(prev => prev.map(r => r.id === reviewId && result.data ? result.data : r));
        return true;
      } else {
        setError(result.error?.message || 'خطا در ویرایش نظر');
        return false;
      }
    } catch (err: any) {
      setError(err?.message || 'خطای غیرمنتظره در ویرایش نظر');
      return false;
    } finally {
      setPending(false);
    }
  }, []);

  const deleteReview = useCallback(async (reviewId: string): Promise<boolean> => {
    setPending(true);
    setError(null);
    try {
      const result = await reviewService.deleteReview(reviewId);
      if (result.success) {
        // حذف از استیت محلی
        setReviews(prev => prev.filter(r => r.id !== reviewId));
        if (selectedReview?.id === reviewId) {
          setSelectedReview(null);
        }
        return true;
      } else {
        setError(result.error?.message || 'خطا در حذف نظر');
        return false;
      }
    } catch (err: any) {
      setError(err?.message || 'خطای غیرمنتظره در حذف نظر');
      return false;
    } finally {
      setPending(false);
    }
  }, [selectedReview]);

  const clearSelection = useCallback(() => {
    setSelectedReview(null);
  }, []);

  // استفاده از useMemo برای جلوگیری از رندر مجدد غیر ضروری
  const value = useMemo(() => ({
    reviews,
    selectedReview,
    loading,
    error,
    pending,
    loadReviews,
    createReview,
    updateReview,
    deleteReview,
    refreshReviews,
    clearSelection
  }), [
    reviews, selectedReview, loading, error, pending,
    loadReviews, createReview, updateReview, deleteReview, refreshReviews, clearSelection
  ]);

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};