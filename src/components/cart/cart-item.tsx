'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, Bookmark, Truck } from 'lucide-react';

export interface CartItemType {
  id: string;
  title: string;
  brand: string;
  sku: string;
  variant: string;
  price: number;
  discount: number;
  qty: number;
  stock: number;
  image: string;
}

interface CartItemProps {
  item: CartItemType;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onSaveForLater: (id: string) => void;
}

export function CartItem({ item, onUpdateQty, onRemove, onSaveForLater }: CartItemProps) {
  const finalPrice = item.price - item.discount;

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 1;
    if (val > item.stock) val = item.stock;
    if (val < 1) val = 1;
    onUpdateQty(item.id, val);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-3 sm:gap-5 p-3.5 sm:p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.03] transition-colors"
    >
      {/* Mobile-optimized smaller image, Desktop keeps original proportion */}
      <div className="relative w-20 h-20 sm:w-32 sm:h-32 rounded-xl bg-white/5 overflow-hidden shrink-0">
        {item.discount > 0 && (
          <div className="absolute top-1.5 right-1.5 z-10 bg-red-500/95 backdrop-blur text-white text-[9px] font-bold px-1 py-0.5 rounded">
            تخفیف
          </div>
        )}
        <Image src={item.image || '/placeholder.png'} alt={item.title} fill className="object-cover" />
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 justify-between min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[rgb(var(--primary))] uppercase tracking-widest">{item.brand}</span>
            <h3 className="text-xs sm:text-base font-bold text-white mt-0.5 mb-1 truncate sm:line-clamp-2">{item.title}</h3>
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-white/40 font-medium">
              <span>{item.variant}</span>
              <span className="w-1 h-1 bg-white/20 rounded-full hidden sm:inline-block" />
              <span className="hidden sm:inline-block">SKU: {item.sku}</span>
            </div>
          </div>
          <div className="text-left shrink-0">
            {item.discount > 0 && (
              <div className="text-[11px] sm:text-xs text-white/30 line-through mb-0.5">{(item.price * item.qty).toLocaleString()}</div>
            )}
            <div className="text-sm sm:text-lg font-extrabold text-white tracking-tight">{(finalPrice * item.qty).toLocaleString()}</div>
            <div className="text-[9px] sm:text-[10px] text-white/40">تومان</div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 mt-2 text-xs font-medium text-emerald-400/85">
          <Truck className="w-3.5 h-3.5" /> ارسال از ۲ روز کاری دیگر
        </div>

        {/* Actions & Qty */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <button onClick={() => onSaveForLater(item.id)} className="flex items-center gap-1 text-[11px] sm:text-xs text-white/40 hover:text-white transition-colors">
              <Bookmark className="w-3.5 h-3.5" /> <span className="hidden sm:inline">ذخیره</span>
            </button>
            <span className="w-px h-3 bg-white/10" />
            <button onClick={() => onRemove(item.id)} className="flex items-center gap-1 text-[11px] sm:text-xs text-white/40 hover:text-red-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">حذف</span>
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white/5 rounded-lg border border-white/10 p-0.5 sm:p-1">
            <button 
              onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))}
              className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <Minus className="w-3 h-3" />
            </button>
            <input 
              type="number" 
              value={item.qty}
              onChange={handleQtyChange}
              className="w-8 sm:w-10 text-center bg-transparent text-xs sm:text-sm font-bold text-white outline-none appearance-none"
            />
            <button 
              onClick={() => onUpdateQty(item.id, Math.min(item.stock, item.qty + 1))}
              disabled={item.qty >= item.stock}
              className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}