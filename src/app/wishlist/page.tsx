'use client';

import React from 'react';
import { Container } from '../../components/ui/container';
import { useWishlist } from '../../contexts/WishlistContext';
import { Trash2, ShoppingCart, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useDevice } from '../../hooks/useDevice';

const mockProductsDatabase: Record<string, any> = {
  'p1': { id: 'p1', title: 'کیبورد مکانیکال AliNavigatorr', price: '۴,۵۰۰,۰۰۰', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=60', rating: 4.8 },
  'p5': { id: 'p5', title: 'پلتفرم X-UI Core ابری', price: 'اشتراکی', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&q=60', rating: 4.9 },
  // ... سایر محصولات
};

export default function WishlistPage() {
  const { items, toggleItem, moveToCart, isMounted: contextMounted } = useWishlist();
  const { isMobile, isMounted: deviceMounted } = useDevice();

  if (!contextMounted || !deviceMounted) return <div className="min-h-screen" />;

  const wishlistProducts = items.map(id => mockProductsDatabase[id] || { id, title: 'محصول تست', price: '۰', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=60', rating: 5 });

  return (
    <div className="flex flex-col min-h-screen pt-24 lg:pt-32 pb-24 font-sans" dir="rtl">
      <Container>
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#14b8a6]/10 flex items-center justify-center text-[#14b8a6]">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-extrabold text-white`}>علاقه‌مندی‌های من</h1>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl">
            <p className="text-white/40">لیست علاقه‌مندی‌های شما خالی است</p>
          </div>
        ) : (
          <div className={isMobile ? "flex flex-col gap-4" : "grid grid-cols-3 gap-6"}>
            {wishlistProducts.map((product) => {
              
              if (isMobile) {
                // رندر اختصاصی موبایل: List View فشرده
                return (
                  <div key={product.id} className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex gap-4 items-center">
                    <img src={product.image} alt={product.title} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h3 className="text-xs font-bold text-white line-clamp-1 mb-2">{product.title}</h3>
                      <p className="text-[10px] text-white/60 mb-3">{product.price} {product.price !== 'اشتراکی' && 'تومان'}</p>
                      <div className="flex gap-2">
                        <button onClick={() => moveToCart(product.id)} className="flex-1 py-2 bg-[#14b8a6]/10 text-[#14b8a6] text-[10px] font-bold rounded-lg flex justify-center items-center gap-1">
                          <ShoppingCart className="w-3 h-3" /> خرید
                        </button>
                        <button onClick={() => toggleItem(product.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              // رندر اختصاصی دسکتاپ: Card View بزرگ
              return (
                <div key={product.id} className="bg-white/[0.02] border border-white/10 rounded-3xl p-5 flex flex-col hover:border-white/20 transition-all">
                  <div className="relative aspect-square w-full rounded-2xl bg-white/5 mb-4 overflow-hidden">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    <button onClick={() => toggleItem(product.id)} className="absolute top-3 left-3 p-2 bg-black/60 text-white/70 hover:text-red-400 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-1 mb-4">{product.title}</h3>
                  <button onClick={() => moveToCart(product.id)} className="w-full py-3 bg-white/5 hover:bg-[#14b8a6] hover:text-black text-white text-xs rounded-xl flex justify-center items-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> انتقال به سبد خرید
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}