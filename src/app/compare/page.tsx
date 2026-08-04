// src/app/compare/page.tsx

import React from 'react';
import CompareLayout from '@/components/compare/compare-layout';
import { comparisonEngine } from '@/services/comparison/comparison-engine';
import { productService } from '@/services/products/product-service';

export default async function ComparePage() {
  // ۱. دریافت داده‌ها از Product Service (تنها منبع تامین داده)
  // در فازهای بعدی، این خط تنها با متد اصلی واکشی داده از API جایگزین می‌شود
  const response = await productService.getMockProductsForComparison();

  // مدیریت خطای دریافت اطلاعات
  if (!response.success || !response.data) {
    return (
      <main className="min-h-screen bg-[#08080A] pt-24 pb-32 px-4 sm:px-8 flex items-center justify-center">
        <div className="text-white text-center p-8 border border-red-500/30 bg-red-500/10 rounded-2xl max-w-lg">
          <h2 className="text-xl font-bold mb-2">خطا در دریافت اطلاعات</h2>
          <p className="text-white/60">{response.error?.message || 'محصولی برای مقایسه یافت نشد.'}</p>
        </div>
      </main>
    );
  }

  const products = response.data;

  // ۲. تغذیه کردن داده‌های خام به موتور مقایسه
  const comparisonResult = comparisonEngine.compareProducts(products);

  // ۳. مدیریت عدم امکان مقایسه (مثلاً دسته‌بندی‌ها فرق داشتند یا تعداد مجاز نبود)
  if (!comparisonResult.isEligible) {
    return (
      <main className="min-h-screen bg-[#08080A] pt-24 pb-32 px-4 sm:px-8 flex items-center justify-center">
        <div className="text-white text-center p-8 border border-red-500/30 bg-red-500/10 rounded-2xl max-w-lg">
          <h2 className="text-xl font-bold mb-2">امکان مقایسه وجود ندارد</h2>
          <p className="text-white/60">{comparisonResult.reason}</p>
        </div>
      </main>
    );
  }

  // ۴. رندر کردن UI نهایی بدون هیچ‌گونه منطق محاسباتی درون ری‌اکت
  return (
    <main className="min-h-screen bg-[#08080A] pt-24 pb-32 px-4 sm:px-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">مقایسه محصولات</h1>
          <p className="text-sm text-white/50">
            موارد <span className="text-[#00FF66]">سبز رنگ</span> نشان‌دهنده امکانات مشترک و موارد <span className="text-white font-bold">سفید</span> نشان‌دهنده تفاوت‌ها هستند.
          </p>
        </div>
        
        <CompareLayout 
          products={products} 
          groups={comparisonResult.groups} 
        />
      </div>
    </main>
  );
}