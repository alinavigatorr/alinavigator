// src/components/reviews/review-form-placeholder.tsx

import React from 'react';
import { Star } from 'lucide-react';

export const ReviewFormPlaceholder: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
      <h3 className="text-xl font-bold text-white mb-6">ثبت نظر جدید</h3>
      
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Rating Placeholder */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/80">
            امتیاز شما
          </label>
          <div className="flex items-center gap-1" aria-label="انتخاب امتیاز" role="radiogroup">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                disabled
                className="p-1 rounded-full text-white/20 hover:text-white/40 transition-colors disabled:cursor-not-allowed"
                aria-label={`امتیاز ${star} از ۵`}
              >
                <Star className="w-8 h-8" strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>

        {/* Title Input Placeholder */}
        <div className="space-y-2">
          <label htmlFor="review-title" className="block text-sm font-medium text-white/80">
            عنوان نظر
          </label>
          <input
            id="review-title"
            type="text"
            disabled
            placeholder="خلاصه‌ای از تجربه شما..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Body Textarea Placeholder */}
        <div className="space-y-2">
          <label htmlFor="review-body" className="block text-sm font-medium text-white/80">
            متن نظر
          </label>
          <textarea
            id="review-body"
            disabled
            rows={4}
            placeholder="نقاط قوت، نقاط ضعف و تجربه کاربری خود را بنویسید..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white text-black font-bold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ثبت نظر
        </button>
      </form>
    </div>
  );
};