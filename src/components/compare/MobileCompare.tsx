'use client';
import React from 'react';
import { X, Minus, Star } from 'lucide-react';

export default function MobileCompare({ products, removeProduct, allSpecsKeys, renderSpecValue }: any) {
  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* هدر محصولات (کارت‌های عمودی زیر هم) */}
      <div className="grid grid-cols-2 gap-3">
        {products.map((product: any) => (
          <div key={product.id} className="relative flex flex-col items-center text-center p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
            <button onClick={() => removeProduct(product.id)} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white/50 hover:text-red-400 rounded-lg z-10">
              <X className="w-4 h-4" />
            </button>
            <img src={product.image} alt={product.title} className="w-20 h-20 object-cover rounded-xl mb-3" />
            <h3 className="text-[11px] font-bold text-white mb-2 line-clamp-2">{product.title}</h3>
            <p className="text-[11px] text-[#00FF66] mb-1">{product.price.toLocaleString('fa-IR')} تومان</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] text-white">{product.rating}</span>
            </div>
          </div>
        ))}
      </div>

      {/* مقایسه مشخصات (گروه‌بندی شده برای جلوگیری از اسکرول افقی) */}
      <div className="flex flex-col gap-4 mt-4">
        {allSpecsKeys.map((key: string) => (
          <div key={key} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white/50 border-b border-white/5 pb-2 mb-1">{key}</h4>
            {products.map((product: any) => (
              <div key={`${product.id}-${key}`} className="flex justify-between items-center text-xs">
                <span className="text-white/70 w-1/3 truncate">{product.title.split(' ')[0]} {product.title.split(' ')[1]}</span>
                <span className="w-2/3 text-left">{renderSpecValue(product.specs?.[key], key)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}