'use client';

import React from 'react';
import { useCompareStore } from '@/store/use-compare-store';
import { Scale, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CompareBar() {
  const { products, removeProduct } = useCompareStore();

  if (products.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4">
      <div className="bg-[#121216]/90 border border-white/15 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          <div className="p-2 bg-[rgb(var(--primary))]/10 rounded-xl text-[rgb(var(--primary))] shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            {products.map((product) => (
              <div key={product.id} className="relative group shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeProduct(product.id)}
                  aria-label="حذف از مقایسه"
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {Array.from({ length: 4 - products.length }).map((_, idx) => (
              <div key={idx} className="shrink-0 w-12 h-12 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-xs text-white/20">
                {products.length + idx + 1}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-white/60 hidden sm:inline">{products.length} از ۴ محصول</span>
          <Link
            href="/compare"
            className="bg-[rgb(var(--primary))] text-black font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all hover:opacity-90"
          >
            <span>مقایسه کن</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}