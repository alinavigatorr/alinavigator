'use client';

import React, { memo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  id: string;
  title: string;
  price: string | number;
  category: string;
  rating: number;
  badge?: string;
  image?: string;
}

export const ProductCard = memo(({ id, title, price, category, rating, badge, image }: ProductCardProps) => {
  const { isInWishlist, toggleItem } = useWishlist();
  const { addItem } = useCart(); 
  
  const liked = isInWishlist(id);
  const defaultImage = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80";
  const displayImg = image || defaultImage;

  const handleProductClick = useCallback(() => {
    try {
      const stored = localStorage.getItem('alinavigator_recent_items');
      let viewed = stored ? JSON.parse(stored) : [];
      viewed = viewed.filter((item: any) => item.id !== id);
      viewed.unshift({ id, title, price, image: displayImg });
      viewed = viewed.slice(0, 6);
      localStorage.setItem('alinavigator_recent_items', JSON.stringify(viewed));
    } catch (e) {}
  }, [id, title, price, displayImg]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 🌟 رفع مشکل قیمت: تبدیل اعداد فارسی به انگلیسی و حذف کاما
    const englishPriceStr = price.toString().replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
    const rawPrice = parseInt(englishPriceStr.replace(/\D/g, '')) || 0;
    
    addItem({
      id: `${id}-default`, // آیدی یونیک برای سبد
      productId: id, // 🌟 رفع مشکل لینک: آیدی اصلی محصول برای مسیریابی
      title,
      price: rawPrice,
      formattedPrice: price.toString(),
      category,
      image: displayImg
    });
  }, [id, title, price, category, displayImg, addItem]);

  const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(id);
  }, [id, toggleItem]);

  return (
    <Link 
      href={`/products/${id}`} 
      onClick={handleProductClick} 
      className="group relative bg-white/[0.02] border border-white/10 rounded-3xl p-3 flex flex-col justify-between h-full hover:border-[#14b8a6]/40 hover:bg-white/[0.04] transition-all block"
    >
      <button 
        onClick={handleToggleWishlist}
        className="absolute top-5 left-5 p-2 bg-black/40 backdrop-blur-md rounded-full transition-all hover:scale-110 hover:bg-[#14b8a6] group/btn z-10"
        title={liked ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      >
        <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-white/70 group-hover/btn:text-black'}`} />
      </button>

      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-white/5 mb-4">
        <Image 
          src={displayImg} 
          alt={title}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        {badge && (
          <span className="absolute top-2 right-2 px-2.5 py-1 bg-[#14b8a6] text-black font-bold text-[10px] rounded-lg">
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-1">
          <span className="text-[10px] text-[#14b8a6] font-medium uppercase tracking-wider">{category}</span>
          <h3 className="text-sm font-bold text-white line-clamp-2 leading-5 min-h-[40px] group-hover:text-[#14b8a6] transition-colors">
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div>
            <span className="text-sm font-bold text-white/90">{price} <span className="text-[10px] text-white/40 font-normal">تومان</span></span>
          </div>
          
          <button 
            onClick={handleAddToCart} 
            className="p-2.5 rounded-xl bg-[#14b8a6]/10 hover:bg-[#14b8a6] text-[#14b8a6] hover:text-black transition-colors z-10"
            title="افزودن به سبد خرید"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'UI_ProductCard';