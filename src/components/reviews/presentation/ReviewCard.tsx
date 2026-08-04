'use client';

import React, { useState } from 'react';
import { Review } from '../../../domain/reviews/review-types';
import { useReviewContext } from '../context/ReviewContext';
import { SellerReply } from './SellerReply';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { voteHelpful, voteUnhelpful, reportReview } = useReviewContext();
  const [hasVoted, setHasVoted] = useState(false);
  const [hasReported, setHasReported] = useState(false);

  // تابع کمکی برای رندر ستاره‌ها
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

  const handleVoteHelpful = () => {
    if (hasVoted) return;
    voteHelpful(review.id);
    setHasVoted(true);
  };

  const handleVoteUnhelpful = () => {
    if (hasVoted) return;
    voteUnhelpful(review.id);
    setHasVoted(true);
  };

  const handleReport = () => {
    if (hasReported) return;
    reportReview(review.id);
    setHasReported(true);
  };

  // 1. وضعیت مخفی / رد شده (محتوا نمایش داده نمی‌شود)
  if (review.status === 'hidden' || review.status === 'rejected') {
    return (
      <div className="p-5 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-md opacity-60">
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
          این دیدگاه به دلیل نقض قوانین پاک شده است.
        </div>
      </div>
    );
  }

  return (
    <div className={`p-5 bg-white/5 border ${review.status === 'reported' ? 'border-[rgb(var(--error))]/30' : review.status === 'pending' ? 'border-amber-500/30' : 'border-white/10'} rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors`}>
      
      {/* پیام‌های وضعیت نظارت (Moderation Banners) */}
      {review.status === 'pending' && (
        <div className="mb-3 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-lg flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          دیدگاه شما ثبت شده و در انتظار تایید مدیران است. (فقط برای شما قابل نمایش است)
        </div>
      )}
      
      {review.status === 'reported' && (
        <div className="mb-3 px-3 py-1.5 bg-[rgb(var(--error))]/10 border border-[rgb(var(--error))]/20 text-[rgb(var(--error))] text-xs rounded-lg flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          این دیدگاه توسط کاربران گزارش شده و در حال بررسی است.
        </div>
      )}

      {/* اطلاعات نویسنده و ستاره‌ها */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {renderStars(review.rating)}
            {review.title && <h4 className="text-base font-bold text-white mr-2">{review.title}</h4>}
          </div>
          
          {/* Trust Signals Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
            <span className="font-medium text-white/90">{review.author.name}</span>
            <span>•</span>
            <span>{new Date(review.createdAt).toLocaleDateString('fa-IR')}</span>
            
            {review.author.isTopReviewer && (
              <>
                <span>•</span>
                <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 01.993.883L11 3v1.077a5.002 5.002 0 013.916 3.659 1 1 0 01-1.92.528A3.001 3.001 0 007.08 8.263a1 1 0 11-1.92-.528A5.002 5.002 0 019 3.077V3a1 1 0 011-1zM5.5 12a1 1 0 01.993.883L6.5 13a3.5 3.5 0 007 0 1 1 0 012 0 5.5 5.5 0 01-11 0 1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  خریدار برتر
                </span>
              </>
            )}

            {review.isVerifiedPurchase && (
              <>
                <span>•</span>
                <span className="text-[rgb(var(--success))] bg-[rgb(var(--success))]/10 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  خریدار این محصول
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* متن نظر */}
      <p className="text-sm text-white/80 leading-relaxed mt-3">{review.comment}</p>
      
      {/* Recommendation Badge */}
      {review.isRecommended && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-[rgb(var(--primary))] font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514" />
          </svg>
          خرید این محصول را پیشنهاد می‌کنم
        </div>
      )}

      {/* نقاط قوت و ضعف */}
      {(review.pros?.length || review.cons?.length) ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {review.pros && review.pros.length > 0 && (
            <div>
              <span className="text-xs text-[rgb(var(--success))] font-medium mb-1 block">نقاط قوت:</span>
              <ul className="text-sm text-white/70 space-y-1">
                {review.pros.map((pro, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[rgb(var(--success))]"></span> {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons && review.cons.length > 0 && (
            <div>
              <span className="text-xs text-[rgb(var(--error))] font-medium mb-1 block">نقاط ضعف:</span>
              <ul className="text-sm text-white/70 space-y-1">
                {review.cons.map((con, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[rgb(var(--error))]"></span> {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}

      {/* Actions (Vote & Report) */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs text-white/50">
          <span>آیا این نظر مفید بود؟</span>
          
          <button 
            onClick={handleVoteHelpful}
            disabled={hasVoted}
            className={`flex items-center gap-1.5 transition-colors ${hasVoted ? 'cursor-not-allowed opacity-50' : 'hover:text-[rgb(var(--success))]'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514" />
            </svg>
            بله ({review.helpfulVotes})
          </button>
          
          <button 
            onClick={handleVoteUnhelpful}
            disabled={hasVoted}
            className={`flex items-center gap-1.5 transition-colors ${hasVoted ? 'cursor-not-allowed opacity-50' : 'hover:text-[rgb(var(--error))]'}`}
          >
            <svg className="w-4 h-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514" />
            </svg>
            خیر ({review.unhelpfulVotes || 0})
          </button>
        </div>

        <button 
          onClick={handleReport}
          disabled={hasReported || review.status === 'reported'}
          className={`flex items-center gap-1 text-xs transition-colors ${hasReported || review.status === 'reported' ? 'text-[rgb(var(--error))] cursor-not-allowed' : 'text-white/40 hover:text-white'}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
          {hasReported || review.status === 'reported' ? 'گزارش ثبت شد' : 'گزارش'}
        </button>
      </div>

      {/* بخش پاسخ فروشنده */}
      {review.status === 'approved' && (
        <SellerReply reviewId={review.id} reply={review.sellerReply} />
      )}
      
    </div>
  );
}