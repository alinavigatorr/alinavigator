// src/components/compare/compare-header.tsx

import React from 'react';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

interface CompareHeaderProps {
  products: Product[];
}

export default function CompareHeader({ products }: CompareHeaderProps) {
  return (
    <div className="flex w-full sticky top-0 z-20 bg-black/40 backdrop-blur-xl border-b border-white/10">
      {/* سلول خالی سمت چپ برای تراز شدن با ستون نام مشخصات */}
      <div className="w-40 sm:w-48 lg:w-56 flex-shrink-0 p-4 sm:p-6 border-l border-white/5 flex items-end justify-start">
        <span className="text-white/40 text-xs sm:text-sm font-medium uppercase tracking-wider">
          مشخصات فنی
        </span>
      </div>

      {/* ستون‌های مربوط به محصولات */}
      <div className="flex-1 flex">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`flex-1 flex flex-col items-center p-4 sm:p-6 relative group ${
              index !== products.length - 1 ? 'border-l border-white/5' : ''
            }`}
          >
            {/* دکمه حذف محصول (فقط UI) */}
            <button 
              className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#FF3366] hover:bg-[#FF3366]/10 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
              aria-label="Remove product"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* تصویر محصول */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gradient-to-b from-white/10 to-transparent mb-4 p-2 flex items-center justify-center border border-white/5">
              {/* از img معمولی استفاده شده تا نیازی به پیکربندی next/image برای دامنه mock نباشد */}
              <img 
                src={product.image} 
                alt={product.name} 
                className="object-cover w-full h-full rounded-xl opacity-90 mix-blend-lighten" 
              />
            </div>

            {/* اطلاعات محصول */}
            <span className="text-white/40 text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-1">
              {product.brand}
            </span>
            <h3 className="text-white font-medium text-center text-sm sm:text-base mb-2 h-10 sm:h-12 line-clamp-2">
              {product.name}
            </h3>
            <span className="text-[#00FF66] font-bold text-base sm:text-lg mb-4 sm:mb-6">
              ${product.price}
            </span>

            {/* دکمه افزودن به سبد خرید */}
            <button
              disabled
              className="w-full py-2 sm:py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/30 text-xs sm:text-sm font-medium cursor-not-allowed"
            >
              افزودن به سبد
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}