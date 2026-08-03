'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className = '' }: WishlistButtonProps) {
  const { isInWishlist, toggleItem, isMounted } = useWishlist();

  // در صورتی که کلاینت لود نشده باشد، یک دکمه خنثی نمایش داده می‌شود
  if (!isMounted) {
    return (
      <div className={`w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/40 ${className}`}>
        <Heart className="w-4 h-4" />
      </div>
    );
  }

  const active = isInWishlist(productId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Heart clicked directly for ID:', productId);
        toggleItem(productId);
      }}
      className={`relative z-50 flex items-center justify-center rounded-full backdrop-blur-md border transition-all duration-300 cursor-pointer p-2.5 
        ${active 
          ? 'border-[rgb(var(--primary))] text-[rgb(var(--primary))] bg-[rgb(var(--primary))]/20 shadow-[0_0_15px_rgba(20,184,166,0.4)]' 
          : 'bg-white/10 border-white/10 text-white/70 hover:text-white hover:bg-white/25'} 
        ${className}`}
      aria-label="افزودن به علاقه‌مندی‌ها"
    >
      <Heart className={`w-4 h-4 transition-transform duration-300 ${active ? 'fill-current scale-110' : 'scale-100'}`} />
    </button>
  );
}