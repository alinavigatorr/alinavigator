'use client';

import React from 'react';
import { useRecentlyViewed } from '../../contexts/RecentlyViewedContext';
import { allProducts } from '../../data/products';
import Link from 'next/link';

export function RecentlyViewedSection() {
  const { viewedIds, isMounted } = useRecentlyViewed();

  if (!isMounted || viewedIds.length === 0) return null;

  const products = viewedIds
    .map(id => allProducts.find(p => p.id === id))
    .filter(Boolean);

  if (products.length === 0) return null;

  return (
    <section className="py-16 border-t border-white/5 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">بازدیدهای اخیر شما</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((product: any) => (
            <Link 
              key={product.id} 
              href={`/products/${product.id}`}
              className="group bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex flex-col justify-between hover:border-[#14b8a6]/40 transition-all"
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-white/5 mb-3">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <h3 className="text-xs font-bold text-white line-clamp-1 mb-1">{product.title}</h3>
              <p className="text-[10px] text-white/60">{product.price ? product.price.toLocaleString('fa-IR') : ''} تومان</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}