'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReviewAnalyticsProps {
  averageRating: number;
  totalReviews: number;
  recommendationPercentage: number;
  distribution: { star: number; count: number }[];
}

export function ReviewAnalytics({ averageRating, totalReviews, recommendationPercentage, distribution }: ReviewAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8">
      {/* بخش میانگین کل */}
      <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-l border-white/10 pb-6 md:pb-0 md:pl-6 text-center">
        <h3 className="text-5xl font-extrabold text-white mb-2 tracking-tight">{averageRating.toFixed(1)}</h3>
        <div className="flex items-center gap-1 mb-2 text-[#14b8a6]">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'fill-current' : 'opacity-30'}`} />
          ))}
        </div>
        <p className="text-sm text-white/50">از مجموع {totalReviews} دیدگاه</p>
        <div className="mt-4 px-4 py-2 bg-[#14b8a6]/10 rounded-xl border border-[#14b8a6]/20">
          <span className="text-xs font-bold text-[#14b8a6]">{recommendationPercentage}٪ خریداران این محصول را پیشنهاد داده‌اند</span>
        </div>
      </div>

      {/* بخش نمودار توزیع امتیازات */}
      <div className="md:col-span-8 flex flex-col justify-center gap-3">
        {distribution.map((item) => {
          const percentage = totalReviews > 0 ? (item.count / totalReviews) * 100 : 0;
          return (
            <div key={item.star} className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 w-12 shrink-0 text-white/70">
                <span>{item.star}</span>
                <Star className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="h-full bg-gradient-to-l from-[#14b8a6] to-[#0ea5e9] rounded-full"
                />
              </div>
              <div className="w-8 text-left text-white/50 text-xs shrink-0">{item.count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}