'use client';

import React, { useState } from 'react';
import { MessageSquare, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- NEW IMPORTS (اتصال به معماری جدید) ---
import { Review } from '@/services/reviews/review-types';
import { ReviewSummary } from './review-summary';
import { ReviewList } from './review-list';
import { ReviewFormPlaceholder } from './review-form-placeholder';

// Mock Data (به‌روزرسانی شده با ساختار Review جدید)
const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    productId: 'p1',
    userId: 'user-123',
    rating: 5,
    title: 'کیفیت ساخت عالی',
    body: 'دقیقا همون چیزی بود که انتظار داشتم. متریال فوق‌العاده با کیفیته.',
    status: 'APPROVED',
    isVerifiedPurchase: true,
    score: 14,
    createdAt: '2023-11-20T10:00:00Z',
  },
  {
    id: '2',
    productId: 'p1',
    userId: 'user-456',
    rating: 4,
    title: 'خوب و کاربردی',
    body: 'طراحی خوبی داره فقط ای کاش کابلش کمی بلندتر بود.',
    status: 'APPROVED',
    isVerifiedPurchase: true,
    score: 2,
    createdAt: '2023-12-05T14:30:00Z',
    sellerReply: {
      text: 'ممنون از نظر شما، پیشنهاد شما به تیم طراحی ارجاع داده شد.',
      repliedAt: '2023-12-06T10:00:00Z',
      sellerId: 'seller-1'
    }
  }
];

export const ReviewSection: React.FC = () => {
  const [filter, setFilter] = useState('newest');
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="mt-16 w-full max-w-7xl mx-auto" aria-labelledby="reviews-heading">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 id="reviews-heading" className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
            <MessageSquare className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          نقد و بررسی‌ها
        </h2>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          className="shrink-0 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          {showForm ? 'انصراف' : 'ثبت دیدگاه جدید'}
        </button>
      </div>

      {/* Review Form (Collapsible) */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 32 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <ReviewFormPlaceholder />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Summary */}
      <div className="mb-8">
        <ReviewSummary 
          averageRating={4.5} 
          totalReviews={124} 
          distribution={{ 5: 98, 4: 18, 3: 8, 2: 0, 1: 0 }} 
        />
      </div>

      {/* Filters Toolbar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
        <h3 className="text-base font-bold text-white">نظرات کاربران</h3>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur-sm transition-colors hover:bg-white/10">
          <Filter className="w-4 h-4 text-white/60" aria-hidden="true" />
          <select 
            className="bg-transparent text-sm text-white/90 outline-none cursor-pointer [&>option]:bg-neutral-900"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="مرتب‌سازی نظرات"
          >
            <option value="newest">جدیدترین</option>
            <option value="helpful">مفیدترین</option>
            <option value="highest">بیشترین امتیاز</option>
            <option value="with_media">عکس‌دار</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <ReviewList reviews={MOCK_REVIEWS} />

      {/* Load More Button Placeholder */}
      {MOCK_REVIEWS.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button 
            type="button"
            className="px-8 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors text-sm font-bold border border-white/10 backdrop-blur-sm"
          >
            مشاهده نظرات بیشتر
          </button>
        </div>
      )}
    </section>
  );
};

export default ReviewSection;