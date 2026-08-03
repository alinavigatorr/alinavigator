'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw, Minus, Plus } from 'lucide-react';

interface PurchasePanelProps {
  price: number;
  discountPrice?: number;
  inStock: boolean;
  stockCount?: number;
}

export function PurchasePanel({ price, discountPrice, inStock, stockCount = 5 }: PurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    }, 800);
  };

  return (
    <div className="sticky top-[120px] bg-white/[0.02] border border-white/5 rounded-[var(--radius-lg)] p-6 flex flex-col gap-6 shadow-2xl backdrop-blur-xl">
      
      {/* Price Section */}
      <div className="flex flex-col gap-1">
        {discountPrice && (
          <span className="text-sm font-medium text-[rgb(var(--text-muted))] line-through decoration-red-500/50">
            {price.toLocaleString()} تومان
          </span>
        )}
        <div className="flex items-end gap-2">
          <span className="text-3xl font-extrabold text-[rgb(var(--text-primary))] tracking-tight">
            {(discountPrice || price).toLocaleString()}
          </span>
          <span className="text-sm text-[rgb(var(--text-muted))] mb-1.5">تومان</span>
        </div>
      </div>

      <div className="h-px bg-white/5 w-full" />

      {/* Stock & Quantity */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${inStock ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`} />
          <span className="text-sm font-medium text-white/80">{inStock ? 'موجود در انبار' : 'ناموجود'}</span>
        </div>
        {inStock && <span className="text-xs text-[rgb(var(--text-muted))]">تنها {stockCount} عدد باقی مانده</span>}
      </div>

      {inStock && (
        <div className="flex items-center justify-between bg-[#0a0a0a] border border-white/10 rounded-xl p-1 w-full max-w-[140px]">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-white/50 hover:text-white transition-colors"><Minus className="w-4 h-4" /></button>
          <span className="text-sm font-bold text-white">{quantity}</span>
          <button onClick={() => setQuantity(Math.min(stockCount, quantity + 1))} className="p-2 text-white/50 hover:text-white transition-colors"><Plus className="w-4 h-4" /></button>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={handleAddToCart}
          disabled={!inStock || isAdding || isSuccess}
          className={`relative w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ease-out flex items-center justify-center gap-2 overflow-hidden ${
            isSuccess 
              ? 'bg-green-500 text-white' 
              : 'bg-[rgb(var(--primary))] text-black hover:bg-[rgb(var(--primary))]/90 active:scale-[0.98]'
          } disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(var(--primary),0.2)]`}
        >
          {isAdding ? (
            <motion.div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : isSuccess ? (
            <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>اضافه شد ✓</motion.span>
          ) : (
            <><ShoppingCart className="w-5 h-5" /> افزودن به سبد خرید</>
          )}
        </button>

        <div className="flex gap-3">
          <button className="flex-1 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white/80 hover:bg-white/10 transition-colors text-sm font-medium flex items-center justify-center gap-2">
            <Heart className="w-4 h-4" /> علاقه‌مندی
          </button>
          <button className="flex-1 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white/80 hover:bg-white/10 transition-colors text-sm font-medium flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" /> اشتراک
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-col gap-4 mt-2 pt-6 border-t border-white/5">
        <div className="flex items-start gap-3">
          <Truck className="w-5 h-5 text-white/40 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white/80">ارسال سریع و مطمئن</p>
            <p className="text-xs text-[rgb(var(--text-muted))] mt-1">تحویل اکسپرس برای سفارشات تهران</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-white/40 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white/80">تضمین اصالت کالا</p>
            <p className="text-xs text-[rgb(var(--text-muted))] mt-1">دارای گارانتی معتبر شرکتی</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RotateCcw className="w-5 h-5 text-white/40 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white/80">۷ روز ضمانت بازگشت</p>
            <p className="text-xs text-[rgb(var(--text-muted))] mt-1">در صورت باز نشدن پلمپ دستگاه</p>
          </div>
        </div>
      </div>
    </div>
  );
}