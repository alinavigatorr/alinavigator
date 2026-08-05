'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../types/product';
import { motion } from 'framer-motion';

export const ProductCard = memo(({ product }: { product: Product }) => {
  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col rounded-3xl bg-white/[0.015] border border-white/[0.04] hover:bg-white/[0.03] hover:border-white/[0.1] hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out overflow-hidden"
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {discountPercent > 0 && (
          <span className="px-2.5 py-1 bg-red-500/90 backdrop-blur-md text-white text-[11px] font-bold rounded-full shadow-[0_4px_12px_rgba(239,68,68,0.3)]">
            {discountPercent}٪ تخفیف
          </span>
        )}
        {!product.inStock && (
          <span className="px-2.5 py-1 bg-white/10 backdrop-blur-md text-white/80 text-[11px] font-bold rounded-full">
            ناموجود
          </span>
        )}
      </div>

      <button className="absolute top-3 left-3 z-10 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/50 hover:text-red-400 hover:bg-white/10 transition-all duration-300 ease-out active:scale-90 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0">
        <Heart className="w-4 h-4" />
      </button>

      {/* Image */}
      <Link href={`/products/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-[#0F0F13]">
        <Image 
          src={product.image} 
          alt={product.title}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
      </Link>

      {/* Content */}
      <div className="flex flex-col p-5 flex-grow">
        <p className="text-[11px] font-bold tracking-wider text-white/40 uppercase mb-1.5">{product.brand}</p>
        <Link href={`/products/${product.id}`} className="outline-none focus-visible:text-[rgb(var(--primary))]">
          <h3 className="text-[15px] font-bold text-white/90 leading-snug tracking-tight line-clamp-2 hover:text-white transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 mt-2.5 mb-4">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-white/90 pt-0.5">{product.rating}</span>
          <span className="text-[10px] font-medium text-white/30 pt-0.5">({product.reviewsCount})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <>
                <span className="text-[11px] font-medium text-white/30 line-through decoration-red-500/50 mb-0.5">
                  {product.price.toLocaleString('fa-IR')} تومان
                </span>
                <span className="text-base font-extrabold text-[rgb(var(--primary))] tracking-tight">
                  {product.discountPrice.toLocaleString('fa-IR')} تومان
                </span>
              </>
            ) : (
              <span className="text-base font-extrabold text-white tracking-tight">
                {product.price.toLocaleString('fa-IR')} تومان
              </span>
            )}
          </div>
          
          <button 
            disabled={!product.inStock}
            className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.05] text-white/70 hover:bg-white hover:text-black transition-all duration-300 ease-out active:scale-90 disabled:opacity-30 disabled:hover:bg-white/[0.05] disabled:hover:text-white/70"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'Product_ProductCard';