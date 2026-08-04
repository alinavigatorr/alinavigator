'use client';
import React from 'react';
import { X, Minus, Star } from 'lucide-react';

export default function TabletCompare({ products, removeProduct, allSpecsKeys, renderSpecValue }: any) {
  return (
    <div className="w-full grid grid-cols-2 gap-4 pb-10">
      {products.map((product: any) => (
        <div key={product.id} className="flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl p-5">
          <div className="relative flex gap-4 items-start border-b border-white/5 pb-4 mb-4">
            <button onClick={() => removeProduct(product.id)} className="absolute top-0 right-0 p-1.5 bg-black/50 text-white/50 hover:text-red-400 rounded-lg z-10">
              <X className="w-4 h-4" />
            </button>
            <img src={product.image} alt={product.title} className="w-24 h-24 object-cover rounded-xl" />
            <div className="flex flex-col gap-2 pt-2">
              <h3 className="text-sm font-bold text-white line-clamp-2">{product.title}</h3>
              <p className="text-xs text-[#00FF66]">{product.price.toLocaleString('fa-IR')} تومان</p>
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs text-white">{product.rating}</span>
                <span className="text-[10px] text-white/40">({product.reviewsCount} نظر)</span>
              </div>
            </div>
          </div>
          
          {/* مشخصات تبلت */}
          <div className="flex flex-col gap-3">
            {allSpecsKeys.map((key: string) => (
              <div key={key} className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                <span className="text-white/40">{key}</span>
                <span>{renderSpecValue(product.specs?.[key], key)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}