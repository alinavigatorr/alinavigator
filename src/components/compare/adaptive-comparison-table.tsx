'use client';

import React from 'react';
import { useCompareStore } from '@/store/use-compare-store';
import { X, Check, Minus } from 'lucide-react';
import { ProductRating } from '@/components/shared/product-rating';

export function AdaptiveComparisonTable() {
  const { products, removeProduct } = useCompareStore();

  if (products.length === 0) {
    return <div className="text-center text-white/50 py-10">محصولی برای مقایسه انتخاب نشده است.</div>;
  }

  // استخراج تمام کلیدهای مشخصات (Specs) از محصولات انتخاب شده
  const allSpecsKeys = Array.from(new Set(products.flatMap((p) => Object.keys(p.specs || {}))));

  // تابع تشخیص وضعیت یک مشخصه برای رندر رنگ مناسب
  const renderSpecValue = (currentProductVal: string | undefined, specKey: string) => {
    if (!currentProductVal) {
      // فاقد امکانات: خط تیره یا ضربدر
      return <Minus className="w-5 h-5 mx-auto text-white/20" />;
    }

    // بررسی اینکه آیا این مشخصه در تمام محصولاتِ دارای این ویژگی، یکسان است؟
    const isIdentical = products.every((p) => p.specs?.[specKey] === currentProductVal);

    if (isIdentical) {
      // مشابه: رنگ سبز خاص سایت
      return <span className="text-[#00FF66] font-medium">{currentProductVal}</span>;
    }

    // تفاوت‌ها: رنگ سفید
    return <span className="text-white font-bold">{currentProductVal}</span>;
  };

  // --------------------------------------------------------
  // نمای مشترک کارت هدر محصولات (عکس، قیمت، ستاره، توضیحات)
  // --------------------------------------------------------
  const renderProductHeader = (product: any) => (
    <div key={product.id} className="relative flex flex-col items-center text-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
      <button 
        onClick={() => removeProduct(product.id)}
        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white/50 hover:text-red-400 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      <img src={product.image} alt={product.title} className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl mb-4" />
      <h3 className="text-xs sm:text-sm font-bold text-white mb-2 line-clamp-2">{product.title}</h3>
      <p className="text-xs text-[#00FF66] mb-3">{product.price.toLocaleString('fa-IR')} تومان</p>
      
      {/* رای و نظر کاربران */}
      <ProductRating rating={product.rating} reviews={product.reviewsCount} />
      
      <p className="text-[10px] text-white/50 mt-3 line-clamp-3">{product.description}</p>
    </div>
  );

  return (
    <div className="w-full bg-[#08080A] text-white rounded-3xl overflow-hidden border border-white/10">
      
      {/* 📱 نمای موبایل (اسکرول افقی نرم برای ۲ کالا در تصویر، بقیه با سوایپ) */}
      <div className="block md:hidden overflow-x-auto snap-x snap-mandatory">
        <div className="flex w-max min-w-full p-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="w-[65vw] snap-center shrink-0 flex flex-col gap-6">
              {renderProductHeader(product)}
              <div className="flex flex-col gap-4 bg-white/[0.01] p-4 rounded-2xl border border-white/5">
                {allSpecsKeys.map((key) => (
                  <div key={key} className="flex flex-col gap-1 border-b border-white/5 pb-2">
                    <span className="text-[10px] text-white/40">{key}</span>
                    <div className="text-xs">{renderSpecValue(product.specs?.[key], key)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 💻 نمای تبلت و دسکتاپ (جدول ساید-بای-ساید کلاسیک) */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead>
            <tr>
              <th className="p-6 bg-white/[0.02] border-b border-white/10 w-48 shrink-0">
                <span className="text-white/40 font-normal">محصولات ({products.length})</span>
              </th>
              {products.map((product) => (
                <th key={product.id} className="p-6 border-b border-white/10 border-r border-white/5 min-w-[250px] align-top">
                  {renderProductHeader(product)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allSpecsKeys.map((key) => (
              <tr key={key} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-5 border-b border-white/5 font-medium text-white/50 group-hover:text-white/80 transition-colors">
                  {key}
                </td>
                {products.map((product) => (
                  <td key={`${product.id}-${key}`} className="p-5 border-b border-white/5 border-r border-white/5 text-center">
                    {renderSpecValue(product.specs?.[key], key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}