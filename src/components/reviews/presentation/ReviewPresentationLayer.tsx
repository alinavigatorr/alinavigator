'use client';

import React from 'react';
import { useReviewContext } from '../context/ReviewContext';
import { WriteReviewForm } from './WriteReviewForm';
import { ReviewCard } from './ReviewCard'; // کامپوننت جدید که در مرحله بعد می‌سازیم

export function ReviewPresentationLayer() {
  const { 
    reviews, stats, isLoading, 
    sortBy, filterBy, starFilter, withImagesFilter,
    setSortBy, setFilterBy, setStarFilter, setWithImagesFilter,
    isWritingReview, setIsWritingReview 
  } = useReviewContext();

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5" dir="ltr">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-amber-400' : 'text-white/20'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
        <div className="w-8 h-8 border-4 border-[rgb(var(--primary))] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر: آمار و ثبت دیدگاه */}
      <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center justify-center min-w-[150px] border-b md:border-b-0 md:border-l border-white/10 pb-6 md:pb-0 md:pl-8">
          <span className="text-5xl font-bold text-white">{stats?.averageRating || 0}</span>
          <div className="mt-2">{renderStars(stats?.averageRating || 0)}</div>
          <span className="text-sm text-white/50 mt-2">از {stats?.totalReviews || 0} نظر</span>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats?.distribution[star as keyof typeof stats.distribution] || 0;
            const percentage = stats?.totalReviews ? (count / stats.totalReviews) * 100 : 0;
            
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-white/70 w-16 whitespace-nowrap">{star} ستاره</span>
                <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-white/40 w-8 text-left">{count}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-r border-white/10 pt-6 md:pt-0 md:pr-8">
          {isWritingReview ? (
            <p className="text-sm text-amber-400 mb-2 text-center font-medium">در حال ثبت دیدگاه...</p>
          ) : (
            <>
              <p className="text-sm text-white/70 mb-4 text-center">شما هم درباره این کالا دیدگاه ثبت کنید</p>
              <button 
                onClick={() => setIsWritingReview(true)}
                className="w-full sm:w-auto px-6 py-2.5 bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/90 text-white text-sm font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(var(--primary),0.2)]"
              >
                ثبت دیدگاه جدید
              </button>
            </>
          )}
        </div>
      </div>

      {isWritingReview ? (
        <WriteReviewForm />
      ) : (
        <>
          {/* Enhanced Filter Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
            <h3 className="text-base font-semibold text-white whitespace-nowrap">نظرات کاربران</h3>
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              
              {/* Star Filter */}
              <select 
                value={starFilter}
                onChange={(e) => setStarFilter(e.target.value)}
                className="px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white/70 focus:outline-none focus:border-[rgb(var(--primary))] appearance-none"
              >
                <option value="all">همه ستاره‌ها</option>
                <option value="5">۵ ستاره</option>
                <option value="4">۴ ستاره</option>
                <option value="3">۳ ستاره</option>
                <option value="2">۲ ستاره</option>
                <option value="1">۱ ستاره</option>
              </select>

              {/* Verified Filter */}
              <select 
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white/70 focus:outline-none focus:border-[rgb(var(--primary))] appearance-none"
              >
                <option value="all">همه نظرات</option>
                <option value="verified">فقط خریداران</option>
              </select>

              {/* With Images Filter (Placeholder) */}
              <label className="flex items-center gap-2 px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white/70 cursor-pointer hover:bg-white/5 transition-colors">
                <input 
                  type="checkbox" 
                  checked={withImagesFilter}
                  onChange={(e) => setWithImagesFilter(e.target.checked)}
                  className="rounded border-white/20 bg-transparent text-[rgb(var(--primary))] focus:ring-[rgb(var(--primary))]"
                />
                عکس‌دار
              </label>

              {/* Sort By */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 rounded-xl text-sm text-[rgb(var(--primary))] focus:outline-none appearance-none font-medium"
              >
                <option value="recent">جدیدترین</option>
                <option value="helpful">مفیدترین</option>
                <option value="highest">بیشترین امتیاز</option>
                <option value="lowest">کمترین امتیاز</option>
              </select>
            </div>
          </div>

          {/* لیست نظرات (واگذار شده به ReviewCard) */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="p-8 text-center bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-white/50">دیدگاهی با این فیلترها یافت نشد.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}