'use client';

import React from 'react';
import { Image as ImageIcon, ShoppingCart, Eye } from 'lucide-react';

interface ProductPreviewCardProps {
  name: string;
  price: string;
  actionType: 'cart' | 'view';
}

export function ProductPreviewCard({ name, price, actionType }: ProductPreviewCardProps) {
  return (
    <div 
      className="flex flex-col p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer focus-within:ring-2 focus-within:ring-[rgb(var(--primary))]/50 focus-within:border-transparent"
      tabIndex={0}
      role="article"
      aria-label={`محصول: ${name}`}
    >
      <div className="w-full aspect-square bg-white/5 rounded-xl mb-3 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
        <ImageIcon className="w-8 h-8 text-white/20 group-hover:text-white/40 transition-colors duration-300" aria-hidden="true" />
      </div>
      <h3 className="text-white text-xs font-medium line-clamp-1 mb-1 group-hover:text-[rgb(var(--primary))] transition-colors duration-300">{name}</h3>
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-white/70 text-xs font-bold">{price} <span className="text-[10px] font-normal opacity-70">تومان</span></span>
        <button 
          aria-label={actionType === 'cart' ? 'افزودن به سبد' : 'مشاهده سریع'}
          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[rgb(var(--primary))] text-white hover:text-black flex items-center justify-center transition-all duration-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-white/50"
          tabIndex={-1} // Prevent double tab focus since parent is focusable
        >
          {actionType === 'cart' ? <ShoppingCart className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}