'use client';

import React, { useState } from 'react';
import { useReviewContext } from '../context/ReviewContext';
import { SellerReply as SellerReplyType } from '../../../domain/reviews/review-types';

interface SellerReplyProps {
  reviewId: string;
  reply?: SellerReplyType;
}

export function SellerReply({ reviewId, reply }: SellerReplyProps) {
  const { submitSellerReply } = useReviewContext();
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (replyText.trim().length < 5) return;
    
    setIsSubmitting(true);
    try {
      await submitSellerReply(reviewId, replyText.trim());
      setIsReplying(false);
      setReplyText('');
    } catch (error) {
      console.error('Failed to submit reply', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. اگر پاسخ قبلاً ثبت شده باشد: نمایش بصری پاسخ فروشنده
  if (reply) {
    return (
      <div className="mt-4 mr-4 md:mr-8 p-4 bg-[rgb(var(--primary))]/5 border-r-2 border-[rgb(var(--primary))] rounded-xl rounded-tr-none">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgb(var(--primary))]/20 text-[rgb(var(--primary))]">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-sm text-[rgb(var(--text-primary))]">پاسخ فروشنده</span>
          <span className="text-xs text-white/40 px-2">•</span>
          <span className="text-xs text-white/40">{new Date(reply.createdAt).toLocaleDateString('fa-IR')}</span>
        </div>
        <p className="text-sm text-white/70 leading-relaxed pr-8">
          {reply.text}
        </p>
      </div>
    );
  }

  // 2. اگر پاسخی وجود ندارد: نمایش دکمه و فرم ثبت پاسخ (حالت Placeholder برای فروشنده)
  return (
    <div className="mt-4 pt-3 border-t border-white/5">
      {!isReplying ? (
        <button 
          onClick={() => setIsReplying(true)}
          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-[rgb(var(--primary))] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          ثبت پاسخ به این نظر (ویژه فروشنده)
        </button>
      ) : (
        <div className="bg-black/30 border border-white/10 rounded-xl p-4 animate-in slide-in-from-top-2 duration-200">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="پاسخ خود را به عنوان فروشنده بنویسید..."
            rows={3}
            className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none resize-none mb-3"
          />
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => {
                setIsReplying(false);
                setReplyText('');
              }}
              className="px-4 py-1.5 text-xs font-medium text-white/60 hover:bg-white/10 rounded-lg transition-colors"
            >
              انصراف
            </button>
            <button 
              onClick={handleSubmit}
              disabled={replyText.trim().length < 5 || isSubmitting}
              className="px-4 py-1.5 bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/80 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
            >
              {isSubmitting ? 'در حال ثبت...' : 'ارسال پاسخ'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}