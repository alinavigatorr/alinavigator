'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Share2, BarChart2, ShoppingCart, Heart, ShieldCheck, RotateCcw, Package, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useCart } from '../../../contexts/CartContext';
import { useParams } from 'next/navigation';

const premiumEase = [0.16, 1, 0.3, 1];

export function ProductGallery() {
  const [activeIdx, setActiveIdx] = useState(0);
  const thumbs = [1, 2, 3, 4];

  return (
    <div className="flex flex-col gap-5">
      <div className="relative aspect-square rounded-[var(--radius-lg)] surface-subtle overflow-hidden group cursor-crosshair ring-1 ring-white/5 shadow-2xl">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: premiumEase }}
          className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent flex items-center justify-center transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        >
          <span className="text-white/40 text-sm font-medium tracking-wide">تصویر اصلی {activeIdx + 1}</span>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {thumbs.map((i, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`relative aspect-square rounded-[var(--radius-md)] surface-subtle flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
              activeIdx === idx
                ? 'ring-2 ring-[rgb(var(--primary))] ring-offset-2 ring-offset-[#08080A] bg-white/10'
                : 'ring-1 ring-white/10 hover:ring-white/30 opacity-70 hover:opacity-100'
            }`}
          >
            <span className="text-white/40 text-xs font-medium">Thumb {i}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProductActions({ price }: { price: string }) {
  const { addItem, increaseQuantity } = useCart();
  const params = useParams();
  const productId = params?.id as string || 'p1';
  
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('مشکی مات');
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const variants = ['مشکی مات', 'نقره‌ای', 'سفید'];

  const handleAddToCart = () => {
    setIsAdding(true);
    
    setTimeout(() => {
      setIsAdding(false);
      setIsSuccess(true);
      
      const englishPriceStr = price.toString().replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
      const rawPrice = parseInt(englishPriceStr.replace(/\D/g, '')) || 0;
      const cartItemId = `${productId}-${selectedVariant}`; 
      
      addItem({
        id: cartItemId,
        productId: productId || 'p1', 
        title: `دستگاه کاستوم شده AliNavigator`,
        price: rawPrice,
        formattedPrice: price,
        category: 'محصولات کاستوم',
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80",
        color: selectedVariant,
        warranty: 'گارانتی ۱۸ ماهه طلایی',
        stock: 3
      });
      
      for(let i = 1; i < qty; i++) {
        increaseQuantity(cartItemId);
      }

      setTimeout(() => setIsSuccess(false), 2000);
    }, 400);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: 'AliNavigator',
      text: 'این محصول فوق‌العاده را در AliNavigator ببینید',
      url: url
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {}
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="flex items-center gap-1.5 bg-[#14b8a6]/10 text-[#14b8a6] px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold border border-[#14b8a6]/10">
          <ShieldCheck className="w-4 h-4" /> گارانتی ۱۸ ماهه طلایی
        </span>
        <span className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold border border-blue-500/10">
          <RotateCcw className="w-4 h-4" /> ۷ روز ضمانت بازگشت
        </span>
        <span className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold border border-amber-500/10">
          <Package className="w-4 h-4" /> ارسال فوری
        </span>
      </div>

      <div className="mb-10 space-y-5">
        <div className="flex items-center">
          <span className="text-sm font-semibold text-[rgb(var(--text-primary))] tracking-wide">رنگ محصول</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {variants.map(color => (
            <button
              key={color}
              onClick={() => setSelectedVariant(color)}
              className={`relative px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                selectedVariant === color
                  ? 'text-white'
                  : 'text-[rgb(var(--text-muted))] hover:text-white bg-white/5 hover:bg-white/10 ring-1 ring-white/10'
              }`}
            >
              {selectedVariant === color && (
                <motion.div
                  layoutId="activeVariant"
                  className="absolute inset-0 bg-[rgb(var(--primary))] rounded-full -z-10 shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {color}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 py-8 border-y border-white/10 mb-10">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="flex items-center justify-between w-full sm:w-36 h-14 bg-white/5 ring-1 ring-white/10 hover:ring-white/20 rounded-[var(--radius-md)] px-2 transition-all duration-300">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5 text-white/40 hover:text-white transition-colors active:scale-90">
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-[rgb(var(--text-primary))] font-semibold text-lg">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="p-2.5 text-white/40 hover:text-white transition-colors active:scale-90">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <Button 
            size="lg" 
            onClick={handleAddToCart}
            disabled={isAdding || isSuccess}
            className={`w-full sm:flex-1 h-14 text-lg flex font-bold tracking-wide shadow-lg transition-all duration-300 overflow-hidden ${
              isSuccess ? 'bg-[rgb(var(--success))] text-white hover:bg-[rgb(var(--success))]' : 'bg-[rgb(var(--primary))] text-black'
            }`}
          >
            {isAdding ? (
              <motion.div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : isSuccess ? (
              <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>به سبد اضافه شد ✓</motion.span>
            ) : (
              "افزودن به سبد خرید"
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-start gap-2 flex-wrap">
          <Button variant="ghost" onClick={() => setIsFavorite(!isFavorite)} className={`gap-2 text-sm h-10 px-4 rounded-full transition-all duration-300 ${isFavorite ? 'text-red-500 hover:text-red-400 bg-red-500/10' : 'text-[rgb(var(--text-muted))] hover:text-white'}`}>
            <Heart className={`w-4 h-4 transition-all duration-300 ${isFavorite ? 'fill-current scale-110' : ''}`} /> علاقه‌مندی
          </Button>
          <div className="w-px h-4 bg-white/10 hidden sm:block mx-1"></div>
          <Button variant="ghost" className="gap-2 text-sm text-[rgb(var(--text-muted))] hover:text-white h-10 px-4 rounded-full transition-colors">
            <BarChart2 className="w-4 h-4" /> مقایسه
          </Button>
          <div className="w-px h-4 bg-white/10 hidden sm:block mx-1"></div>
          <Button variant="ghost" onClick={handleShare} className="gap-2 text-sm text-[rgb(var(--text-muted))] hover:text-white h-10 px-4 rounded-full transition-colors">
            {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'کپی شد' : 'اشتراک‌گذاری'}
          </Button>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] bg-[#08080A]/90 backdrop-blur-2xl border-t border-white/10 z-[80] flex items-center gap-5 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] supports-[backdrop-filter]:bg-[#08080A]/70">
        <div className="flex flex-col min-w-fit">
          <span className="text-xs font-medium text-white/50 mb-0.5">مبلغ نهایی</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-[rgb(var(--text-primary))]">{price}</span>
            <span className="text-[10px] font-medium text-[rgb(var(--primary))]">تومان</span>
          </div>
        </div>
        <Button 
          onClick={handleAddToCart}
          disabled={isAdding || isSuccess}
          className={`flex-1 h-12 shadow-[0_0_20px_rgba(20,184,166,0.2)] font-bold transition-all ${
            isSuccess ? 'bg-[rgb(var(--success))] text-white' : ''
          }`}
        >
          {isAdding ? (
            <motion.div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : isSuccess ? (
            <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>اضافه شد ✓</motion.span>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 ml-2" />
              افزودن به سبد
            </>
          )}
        </Button>
      </div>
    </>
  );
}

export function ProductSpecs({ description }: { description?: string }) {
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');

  const mockSpecs = [
    { key: 'سازنده', value: 'AliNavigator Custom' },
    { key: 'متریال', value: 'آلیاژ فلزی مات' },
    { key: 'پشتیبانی', value: 'گارانتی اصالت و سلامت' },
    { key: 'وضعیت', value: 'آماده ارسال' },
  ];

  return (
    <div className="mt-6 mb-10">
      <div className="flex items-center gap-10 border-b border-white/10 mb-8">
        <button onClick={() => setActiveTab('desc')} className={`pb-5 text-sm font-semibold tracking-wide transition-colors relative ${activeTab === 'desc' ? 'text-white' : 'text-white/40 hover:text-white/80'}`}>
          معرفی محصول
          {activeTab === 'desc' && <motion.div layoutId="tab-indicator" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[rgb(var(--primary))] shadow-[0_0_10px_rgba(20,184,166,0.5)]" />}
        </button>
        <button onClick={() => setActiveTab('specs')} className={`pb-5 text-sm font-semibold tracking-wide transition-colors relative ${activeTab === 'specs' ? 'text-white' : 'text-white/40 hover:text-white/80'}`}>
          مشخصات فنی
          {activeTab === 'specs' && <motion.div layoutId="tab-indicator" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[rgb(var(--primary))] shadow-[0_0_10px_rgba(20,184,166,0.5)]" />}
        </button>
      </div>

      <div className="min-h-[160px]">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }} transition={{ duration: 0.3, ease: premiumEase }} className="text-white/70 leading-loose text-[15px]">
            {activeTab === 'desc' ? <div className="prose prose-invert max-w-none"><p>{description}</p></div> : (
              <div className="flex flex-col gap-1">
                {mockSpecs.map((s, i) => (
                  <div key={i} className="flex justify-between items-center py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
                    <span className="text-white/50 text-sm">{s.key}</span>
                    <span className="text-white font-medium text-sm tracking-wide">{s.value}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}