'use client';
import React from 'react';
import { X, Minus, Star } from 'lucide-react';

export default function DesktopCompare({ products, removeProduct, allSpecsKeys, renderSpecValue }: any) {
  return (
    <div className="w-full bg-[#121216] text-white rounded-3xl border border-white/10 shadow-2xl">
      <table className="w-full text-sm text-right table-fixed">
        <thead>
          <tr>
            <th className="p-6 bg-white/[0.02] border-b border-white/10 w-1/5">
              <span className="text-white/40 font-normal">مشخصات فنی</span>
            </th>
            {products.map((product: any) => (
              <th key={product.id} className="p-6 border-b border-white/10 border-r border-white/5 align-top relative">
                <button onClick={() => removeProduct(product.id)} className="absolute top-4 right-4 p-1.5 bg-black/50 text-white/50 hover:text-red-400 rounded-lg transition-colors z-10">
                  <X className="w-4 h-4" />
                </button>
                <div className="flex flex-col items-center text-center">
                  <img src={product.image} alt={product.title} className="w-32 h-32 object-cover rounded-xl mb-4" />
                  <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 h-10">{product.title}</h3>
                  <p className="text-xs text-[#00FF66] mb-2">{product.price.toLocaleString('fa-IR')} تومان</p>
                  <div className="flex items-center gap-1.5 justify-center mb-3">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-white">{product.rating}</span>
                    <span className="text-[10px] text-white/40">({product.reviewsCount} نظر)</span>
                  </div>
                  <p className="text-[11px] text-white/50 line-clamp-2 font-normal leading-relaxed">{product.description}</p>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allSpecsKeys.map((key: string) => (
            <tr key={key} className="hover:bg-white/[0.02] transition-colors group">
              <td className="p-5 border-b border-white/5 font-medium text-white/50 group-hover:text-white/80 transition-colors">
                {key}
              </td>
              {products.map((product: any) => (
                <td key={`${product.id}-${key}`} className="p-5 border-b border-white/5 border-r border-white/5 text-center">
                  {renderSpecValue(product.specs?.[key], key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}