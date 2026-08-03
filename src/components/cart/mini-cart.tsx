'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, Share2, CheckCircle2, ShieldCheck, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';

export function MiniCart() {
  const { isCartOpen, toggleCart, items, totalItems, formattedSubtotal, increaseQuantity, decreaseQuantity, removeItem, isMounted } = useCart();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // 🌟 ویژگی اسپرینت ۱۳: Focus Trap برای Accessibility
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      containerRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  // سیستم پیشرفته اشتراک‌گذاری برای مینی‌کارت
  const handleShare = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const targetId = e.currentTarget.getAttribute('data-product-id') || 'p1';
    const productTitle = e.currentTarget.getAttribute('data-product-title') || 'AliNavigator';
    const url = `${window.location.origin}/products/${targetId}`;
    
    const shareData = {
      title: productTitle,
      text: `محصول را در AliNavigator ببینید: ${productTitle}`,
      url: url
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setCopiedId(targetId);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch (err) {
      console.log('Share canceled or not supported by OS');
    }
  }, []);

  // 🌟 ویژگی اسپرینت ۱۳: حذف Inline Functions برای Performance Optimization
  const handleIncrease = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.getAttribute('data-id');
    if (id) increaseQuantity(id);
  }, [increaseQuantity]);

  const handleDecrease = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.getAttribute('data-id');
    if (id) decreaseQuantity(id);
  }, [decreaseQuantity]);

  const handleRemove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.getAttribute('data-id');
    if (id) removeItem(id);
  }, [removeItem]);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={toggleCart} 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" 
            aria-hidden="true"
          />

          <motion.div
            ref={containerRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="سبد خرید"
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 bottom-0 left-0 w-full max-w-md bg-[rgb(18,21,32)]/40 backdrop-blur-2xl border-r border-white/10 z-[101] flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)] supports-[backdrop-filter]:bg-[rgb(18,21,32)]/40 outline-none"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#14b8a6]" aria-hidden="true" />
                سبد خرید <span className="text-[10px] sm:text-xs bg-[#14b8a6]/20 text-[#14b8a6] px-2 py-0.5 rounded-full">{totalItems}</span>
              </h2>
              <button onClick={toggleCart} aria-label="بستن سبد خرید" className="p-2 text-white/40 hover:text-white bg-white/5 rounded-full transition-colors focus:ring-2 focus:ring-[#14b8a6] outline-none">
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 [scrollbar-width:none]">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/50 space-y-3" role="status">
                  <ShoppingBag className="w-10 h-10 opacity-20" aria-hidden="true" />
                  <p className="text-sm">سبد خرید خالی است.</p>
                </div>
              ) : (
                items.map(item => {
                  const safeProductId = item.productId || 'p1';
                  const isMaxStock = item.stock !== undefined && item.quantity >= item.stock;

                  return (
                    <div key={item.id} className="flex flex-col gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 relative group transition-colors hover:border-white/20 shadow-lg">
                      
                      <div className="pl-14">
                        <Link href={`/products/${safeProductId}`} onClick={toggleCart} aria-label={`مشاهده محصول ${item.title}`}>
                          <h3 className="text-sm font-bold text-white line-clamp-2 hover:text-[#14b8a6] leading-relaxed">{item.title}</h3>
                        </Link>
                      </div>
                      
                      <div className="flex gap-3 sm:gap-4 items-start">
                        <Link href={`/products/${safeProductId}`} onClick={toggleCart} tabIndex={-1} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/5 overflow-hidden shrink-0 block">
                          <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </Link>
                        
                        <div className="flex flex-col flex-1 justify-between py-0.5">
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium" aria-label="مشخصات محصول">
                            {item.color && <span className="flex items-center gap-1 bg-white/5 text-white/60 px-1.5 py-0.5 rounded-md border border-white/5"><span className="w-1.5 h-1.5 rounded-full bg-white/30" aria-hidden="true"></span> {item.color}</span>}
                            {item.warranty && <span className="flex items-center gap-1 bg-[#14b8a6]/10 text-[#14b8a6] px-1.5 py-0.5 rounded-md border border-[#14b8a6]/10"><ShieldCheck className="w-3 h-3" /> {item.warranty}</span>}
                            <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-md border border-blue-500/10"><RotateCcw className="w-3 h-3" /> ۷ روز ضمانت</span>
                          </div>
                          
                          <div className="flex flex-row items-center justify-between w-full mt-2 pt-2 border-t border-white/5">
                            <span className="text-sm font-bold text-white/90" aria-label={`قیمت: ${item.formattedPrice}`}>{item.formattedPrice}</span>
                            <div className="flex items-center gap-1.5 bg-black/20 rounded-lg px-1.5 py-1 border border-white/5">
                              <button data-id={item.id} onClick={handleDecrease} aria-label="کاهش تعداد" className="p-1 text-white/40 hover:text-white focus:ring-2 focus:ring-white/20 rounded-md outline-none transition-colors"><Minus className="w-3 h-3" aria-hidden="true" /></button>
                              <span className="text-[11px] sm:text-xs font-bold text-white w-4 text-center" aria-live="polite">{item.quantity}</span>
                              <button data-id={item.id} onClick={handleIncrease} disabled={isMaxStock} aria-disabled={isMaxStock} aria-label="افزایش تعداد" className="p-1 text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed focus:ring-2 focus:ring-white/20 rounded-md outline-none transition-colors"><Plus className="w-3 h-3" aria-hidden="true" /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all flex flex-row gap-1">
                        <button data-product-id={safeProductId} data-product-title={item.title} onClick={handleShare} aria-label="اشتراک‌گذاری" className="p-1.5 bg-[rgb(18,21,32)] text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg border border-white/10 shadow-lg cursor-pointer focus:ring-2 focus:ring-blue-400 outline-none">
                          {copiedId === safeProductId ? <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> : <Share2 className="w-3 h-3" aria-hidden="true" />}
                        </button>
                        <button data-id={item.id} onClick={handleRemove} aria-label="حذف از سبد" className="p-1.5 bg-[rgb(18,21,32)] text-red-400 hover:bg-red-500 hover:text-white rounded-lg border border-white/10 shadow-lg focus:ring-2 focus:ring-red-400 outline-none">
                          <Trash2 className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t border-white/10 bg-black/20 shrink-0">
                <div className="flex items-center justify-between mb-5"><span className="text-xs sm:text-sm text-white/60">جمع کل:</span><span className="text-lg sm:text-xl font-black text-[#14b8a6]" aria-live="polite">{formattedSubtotal}</span></div>
                <div className="flex gap-2 sm:gap-3">
                  <button onClick={toggleCart} aria-label="ادامه خرید" className="flex-1 px-3 py-2.5 sm:py-3 rounded-xl border border-white/20 text-white/80 text-xs sm:text-sm font-bold hover:bg-white/10 transition-colors focus:ring-2 focus:ring-white/40 outline-none">ادامه خرید</button>
                  <Link href="/cart" onClick={toggleCart} aria-label="تکمیل خرید" className="flex-1 px-3 py-2.5 sm:py-3 rounded-xl bg-[#14b8a6] text-black text-xs sm:text-sm font-bold hover:bg-[#14b8a6]/90 transition-colors text-center shadow-[0_0_20px_rgba(20,184,166,0.2)] focus:ring-2 focus:ring-[#14b8a6] outline-none">تکمیل خرید</Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}