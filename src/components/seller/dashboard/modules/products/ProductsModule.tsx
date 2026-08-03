'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SellerProductService } from '@/services/seller/products/seller-product-service';
import { SellerProductModel, SellerProductStatus } from '@/services/seller/products/seller-product-types';

export function ProductsModule() {
  const [products] = useState<SellerProductModel[]>(SellerProductService.getAllProducts());

  // تابع کمکی برای استایل و متن وضعیت‌های ۵ گانه
  const getStatusConfig = (status: SellerProductStatus) => {
    switch (status) {
      case 'published':
        return { label: 'منتشر شده', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'draft':
        return { label: 'پیش‌نویس', classes: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
      case 'hidden':
        return { label: 'مخفی', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'out_of_stock':
        return { label: 'ناموجود', classes: 'bg-red-500/10 text-red-400 border-red-500/20' };
      case 'archived':
        return { label: 'آرشیو شده', classes: 'bg-white/5 text-white/50 border-white/10' };
      default:
        return { label: 'نامشخص', classes: 'bg-white/5 text-white/50 border-white/10' };
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر ماژول */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">مدیریت محصولات</h1>
          <p className="text-sm text-white/50 mt-1">کاتالوگ کالاهای فروشگاه خود را مدیریت کنید.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          + افزودن محصول جدید
        </button>
      </div>

      {/* نوار ابزار (Toolbar - Placeholders) */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
        {/* جستجو */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="جستجوی نام محصول، SKU و..."
            className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          <svg className="w-4 h-4 text-white/40 absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* فیلترها و عملیات گروهی */}
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            فیلترها
          </button>
          <select className="px-4 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white/70 focus:outline-none appearance-none pr-8">
            <option value="">عملیات گروهی (Bulk)</option>
            <option value="publish">انتشار</option>
            <option value="hide">مخفی‌سازی</option>
            <option value="delete">حذف</option>
            <option value="export">خروجی اکسل</option>
          </select>
        </div>
      </div>

      {/* لیست محصولات (Product Cards / List) */}
      <div className="grid grid-cols-1 gap-4">
        {products.map(product => {
          const statusConfig = getStatusConfig(product.status);

          return (
            <div key={product.id} className="flex flex-col md:flex-row gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors group">
              {/* تصویر بندانگشتی */}
              <div className="relative w-full md:w-32 h-32 md:h-24 rounded-xl overflow-hidden bg-black/50 flex-shrink-0">
                <img
                  src={product.thumbnailUrl}
                  alt={product.title}
                  className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>

              {/* اطلاعات اصلی */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold text-white">{product.title}</h3>
                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${statusConfig.classes}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="text-xs text-white/40 mt-1 flex gap-3">
                    <span>SKU: {product.sku}</span>
                    <span>شناسه: {product.id}</span>
                  </div>
                </div>

                {/* Badges (Category, Brand, Price, Inventory) */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {/* Category Badge */}
                  <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60">
                    {product.category}
                  </span>

                  {/* Brand Badge */}
                  {product.brand && (
                    <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60">
                      {product.brand}
                    </span>
                  )}

                  {/* Inventory Badge */}
                  <span className={`px-2 py-1 border rounded-lg text-xs flex items-center gap-1 ${product.stockQuantity > 0
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                    موجودی: {product.stockQuantity} عدد
                  </span>

                  {/* Price Badge */}
                  <span className="mr-auto px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-sm font-bold text-white">
                    {product.price.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* صفحه‌بندی (Pagination - Placeholder) */}
      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
        <span className="text-sm text-white/50">نمایش ۱ تا ۵ از ۵ محصول</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-black/50 border border-white/10 rounded-lg text-sm text-white/40 cursor-not-allowed">
            قبلی
          </button>
          <button className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm">
            ۱
          </button>
          <button className="px-3 py-1 bg-black/50 border border-white/10 rounded-lg text-sm text-white/70 hover:bg-white/10">
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
}