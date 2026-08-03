// src/components/reviews/review-summary.tsx

import React from 'react';
import { Star } from 'lucide-react';

interface ReviewSummaryProps {
  averageRating?: number;
  totalReviews?: number;
  distribution?: Record<number, number>;
}

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  averageRating = 4.8,
  totalReviews = 128,
  distribution = { 5: 85, 4: 20, 3: 15, 2: 5, 1: 3 }
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
      
      {/* Average Rating Block */}
      <div className="flex flex-col items-center justify-center shrink-0 md:w-1/3 border-b md:border-b-0 md:border-l border-white/10 pb-6 md:pb-0 md:pl-8">
        <h2 className="text-5xl md:text-6xl font-black text-white mb-3">
          {averageRating.toFixed(1)}
        </h2>
        <div className="flex items-center gap-1 mb-3" aria-label={`میانگین امتیاز ${averageRating} از ۵`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 transition-colors duration-300 ${
                star <= Math.round(averageRating) 
                  ? 'text-white fill-white' 
                  : 'text-white/20 fill-transparent'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-white/60 font-medium">
          از مجموع {totalReviews} نظر
        </p>
      </div>

      {/* Breakdown Bars Block */}
      <div className="flex-1 flex flex-col justify-center gap-3">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star] || 0;
          // محاسبه درصد پر شدن نوار وضعیت
          const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
          
          return (
            <div key={star} className="flex items-center gap-4 text-sm group">
              <div className="flex items-center gap-1 w-8 text-white/80 shrink-0">
                <span className="font-bold text-base leading-none pt-1">{star}</span>
                <Star className="w-4 h-4 fill-white/80 text-white/80" />
              </div>
              
              <div 
                className="flex-1 h-2 rounded-full bg-white/5 border border-white/5 overflow-hidden" 
                role="progressbar" 
                aria-valuenow={percentage} 
                aria-valuemin={0} 
                aria-valuemax={100}
                aria-label={`درصد نظرات ${star} ستاره`}
              >
                <div 
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out group-hover:opacity-80"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="w-10 text-left text-white/50 font-medium shrink-0">
                {count}
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
};