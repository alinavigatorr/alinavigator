'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, ShieldCheck, CreditCard, Bookmark, Share2, CheckCircle2, Package, RotateCcw, Minus, Plus } from 'lucide-react';
import { Container } from '../../components/ui/container';
import { useCart } from '../../contexts/CartContext';

export default function CartPage() {
  const { items, savedItems, totalItems, formattedSubtotal, removeItem, increaseQuantity, decreaseQuantity, clearCart, isMounted, saveForLater, moveToCart, removeSavedItem } = useCart();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleShare = async (e: React.MouseEvent, productId: string, productTitle: string) => {
    e.preventDefault();
    e.stopPropagation();
    const targetId = productId || 'p1';
    const url = `${window.location.origin}/products/${targetId}`;
    
    const shareData = {
      title: productTitle || 'AliNavigator',
      text: `این محصول فوق‌العاده را در AliNavigator ببینید: ${productTitle}`,
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
  };

  if (!hasMounted || !isMounted) return null;

  return (
    <div className="min-h-screen pt-32 pb-24">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3 tracking-tight">
            <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-[#14b8a6]" />
            سبد خرید شما
          </h1>
        </div>

        {items.length === 0 && savedItems.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center p-12 sm:p-16 rounded-3xl bg-white/[0.02] border border-white/5 text-center shadow-2xl">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/5 flex items-center justify-center mb-6"><ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-white/20" /></div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">سبد خرید شما خالی است!</h2>
            <p className="text-sm sm:text-base text-white/50 mb-8 max-w-md">در حال حاضر هیچ محصولی در سبد خرید شما وجود ندارد.</p>
            <Link href="/products" className="px-6 py-3 rounded-xl bg-[#14b8a6] text-black text-sm sm:text-base font-bold hover:bg-[#14b8a6]/90 transition-colors shadow-[0_0_20px_rgba(20,184,166,0.2)]">مشاهده محصولات</Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              
              {items.length > 0 && (
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}
                        key={item.id} 
                        className="flex flex-col gap-3 p-4 sm:p-5 rounded-3xl bg-white/[0.03] border border-white/10 relative group transition-colors hover:border-white/20 shadow-lg"
                      >
                        <div className="pl-10 sm:pl-12">
                          <Link href={`/products/${item.productId || 'p1'}`}>
                            <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2 hover:text-[#14b8a6] leading-relaxed transition-colors">{item.title}</h3>
                          </Link>
                        </div>
                        
                        <div className="flex gap-4 sm:gap-5 items-start">
                          <Link href={`/products/${item.productId || 'p1'}`} className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-white/5 overflow-hidden shrink-0 block">
                            <img src={item.image || "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80"} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </Link>
                          
                          <div className="flex flex-col flex-1 justify-between min-h-[5rem] sm:min-h-[7rem]">
                            <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs font-medium">
                              {item.color && <span className="flex items-center gap-1 bg-white/5 text-white/60 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-white/5"><span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>رنگ: {item.color}</span>}
                              {item.warranty && <span className="flex items-center gap-1 bg-[#14b8a6]/10 text-[#14b8a6] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-[#14b8a6]/10"><ShieldCheck className="w-3 h-3" />{item.warranty}</span>}
                              <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-blue-500/10"><RotateCcw className="w-3 h-3" />۷ روز ضمانت</span>
                              {item.stock && item.stock < 5 && <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-amber-500/10"><Package className="w-3 h-3" />تنها {item.stock} عدد</span>}
                            </div>
                            
                            <div className="flex flex-row items-center justify-between w-full mt-3 pt-3 border-t border-white/5">
                              <span className="text-base sm:text-lg font-bold text-white/90">{item.formattedPrice}</span>
                              <div className="flex items-center gap-2 bg-[#0a0a0a] rounded-xl px-1.5 py-1 border border-white/10 w-fit">
                                <button onClick={() => decreaseQuantity(item.id)} className="p-1 sm:p-1.5 text-white/40 hover:text-white transition-colors"><Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                                <span className="text-xs sm:text-sm font-bold text-white w-5 sm:w-6 text-center">{item.quantity}</span>
                                <button onClick={() => increaseQuantity(item.id)} disabled={item.stock ? item.quantity >= item.stock : false} className="p-1 sm:p-1.5 text-white/40 hover:text-white transition-colors disabled:opacity-30"><Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* 🌟 دکمه‌های «ذخیره برای بعد» و «اشتراک‌گذاری» در سمت راست و در مجاورت هم */}
                        <div className="flex items-center gap-4 pt-3 mt-1 border-t border-white/5 text-[10px] sm:text-xs">
                          <button onClick={() => saveForLater(item.id)} className="flex items-center gap-1.5 text-white/50 hover:text-[#14b8a6] transition-colors"><Bookmark className="w-3.5 h-3.5" /> ذخیره برای بعد</button>
                          <button onClick={(e) => handleShare(e, item.productId || 'p1', item.title)} className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors cursor-pointer z-10 relative">
                            {copiedId === (item.productId || 'p1') ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />} {copiedId === (item.productId || 'p1') ? 'کپی شد' : 'اشتراک‌گذاری'}
                          </button>
                        </div>
                        
                        <button onClick={() => removeItem(item.id)} className="absolute top-3 left-3 p-1.5 bg-[#12151c] text-red-400 hover:bg-red-500 hover:text-white rounded-lg border border-white/10 shadow-lg transition-colors z-10"><Trash2 className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {savedItems.length > 0 && (
                <div className="pt-6 mt-6 border-t border-white/5">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Bookmark className="w-4 h-4 text-white/40" /> ذخیره‌شده برای بعد ({savedItems.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AnimatePresence>
                      {savedItems.map(item => (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} key={item.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col gap-3 relative group hover:border-white/20 transition-colors">
                          <div className="flex gap-3">
                            <div className="w-14 h-14 rounded-xl bg-white/5 overflow-hidden shrink-0"><img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" /></div>
                            <div className="flex flex-col justify-center flex-1 pr-1">
                              <h4 className="text-xs font-bold text-white line-clamp-2 leading-relaxed">{item.title}</h4>
                              <span className="text-[10px] text-[#14b8a6] font-bold mt-1.5">{item.formattedPrice}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between border-t border-white/5 pt-2">
                            <button onClick={() => moveToCart(item.id)} className="text-[11px] bg-[#14b8a6]/10 text-[#14b8a6] hover:bg-[#14b8a6] hover:text-black px-2 py-1 rounded-md font-bold transition-colors">انتقال به سبد</button>
                            <button onClick={() => removeSavedItem(item.id)} className="p-1.5 text-white/40 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-24 p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-5 shadow-2xl">
                <h3 className="text-lg sm:text-xl font-bold text-white border-b border-white/10 pb-3 sm:pb-4">خلاصه سفارش</h3>
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                  <div className="flex justify-between text-white/60"><span>تعداد اقلام:</span><span className="text-white font-bold">{totalItems} کالا</span></div>
                  <div className="flex justify-between text-white/60"><span>هزینه ارسال:</span><span className="text-amber-400 text-[10px] sm:text-xs font-bold mt-0.5 bg-amber-400/10 px-1.5 py-0.5 rounded">وابسته به آدرس</span></div>
                </div>
                <div className="pt-4 sm:pt-5 border-t border-white/10">
                  <div className="flex justify-between items-end mb-5"><span className="text-xs sm:text-sm text-white/80 font-medium">مبلغ قابل پرداخت:</span><span className="text-xl sm:text-2xl font-black text-[#14b8a6]">{formattedSubtotal}</span></div>
                  <button disabled={items.length === 0} className="w-full py-3 sm:py-4 rounded-xl bg-[#14b8a6] text-black font-bold text-base sm:text-lg hover:bg-[#14b8a6]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(20,184,166,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"><CreditCard className="w-5 h-5" /> تکمیل خرید</button>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/5 mt-4 sm:mt-6">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#14b8a6] shrink-0" />
                  <p className="text-[10px] sm:text-xs text-white/50 leading-relaxed">تضمین اصالت کالا و بازگشت وجه در صورت مغایرت. پرداخت امن از طریق درگاه‌های معتبر.</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </Container>
    </div>
  );
}