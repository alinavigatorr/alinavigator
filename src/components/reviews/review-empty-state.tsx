// src/components/reviews/review-empty-state.tsx

import React from 'react';
import { MessageSquarePlus } from 'lucide-react';

export const ReviewEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-500 hover:bg-white/10 hover:border-white/20">
      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
        <MessageSquarePlus className="w-10 h-10 text-white/40" aria-hidden="true" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3">
        هنوز نظری ثبت نشده است
      </h3>
      
      <p className="text-sm text-white/60 mb-8 text-center max-w-sm leading-relaxed">
        تجربه استفاده خود از این محصول را به اشتراک بگذارید تا به دیگران در انتخابی مطمئن‌تر کمک کنید.
      </p>
      
      <button 
        type="button"
        disabled
        className="px-8 py-3 rounded-xl bg-white text-black font-bold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="اولین نفری باشید که نظر می‌دهد"
      >
        اولین نفری باشید که نظر می‌دهد
      </button>
    </div>
  );
};