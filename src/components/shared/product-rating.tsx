'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface ProductRatingProps {
  rating: number;
  reviews?: number;
}

export function ProductRating({ rating, reviews }: ProductRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(rating);
          return (
            <Star
              key={star}
              className={`w-3.5 h-3.5 ${
                filled ? 'text-amber-400 fill-amber-400' : 'text-white/20'
              }`}
            />
          );
        })}
      </div>
      <span className="text-[10px] text-white/40">
        {rating.toLocaleString('fa-IR')}
        {reviews !== undefined && ` (${reviews.toLocaleString('fa-IR')})`}
      </span>
    </div>
  );
}
