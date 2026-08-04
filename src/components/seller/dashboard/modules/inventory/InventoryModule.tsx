'use client';

import React, { useState } from 'react';
import { SellerInventoryService } from '@/services/seller/inventory/seller-inventory-service';
import { SellerInventoryModel, SellerStockStatus } from '@/services/seller/inventory/seller-inventory-types';

export function InventoryModule() {
  const [inventoryList] = useState<SellerInventoryModel[]>(SellerInventoryService.getAllInventory());

  // تابع کمکی برای استایل و نشان‌گر وضعیت‌های ۵ گانه موجودی
  const getStockStatusConfig = (status: SellerStockStatus) => {
    switch (status) {
      case 'in_stock':
        return { label: 'موجود در انبار', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'low_stock':
        return { label: 'موجودی رو به کاهش', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'critical_stock':
        return { label: 'موجودی بحرانی', classes: 'bg-orange-500/10 text-orange-400 border-orange-500/20' };
      case 'out_of_stock':
        return { label: 'ناموجود', classes: 'bg-red-500/10 text-red-400 border-red-500/20' };
      case 'archived':
        return { label: 'آرشیو شده', classes: 'bg-white/5 text-white/40 border-white/10' };
      default:
        return { label: 'نامشخص', classes: 'bg-white/5 text-white/50 border-white/10' };
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر ماژول */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">مدیریت انبار و موجودی</h1>
          <p className="text-sm text-white/50 mt-1">کنترل موجودی انبارها، هشدارهای کسر موجودی و ثبت ورود/خروج کالا.</p>
        </div>
        <div className="flex gap-2">
          {/* Restock Placeholder Button */}
          <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            + افزایش موجودی (Restock)
          </button>
        </div>
      </div>

      {/* نوار ابزار (Toolbar & Bulk Actions Placeholders) */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
        {/* جستجو بر اساس SKU، بارکد یا عنوان */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="جستجو با عنوان کالا، SKU، بارکد یا انبار..."
            className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          <svg className="w-4 h-4 text-white/40 absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* فیلتر وضعیت و عملیات گروهی */}
        <div className="flex flex-wrap gap-2">
          <select className="px-4 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white/70 focus:outline-none appearance-none">
            <option value="">همه وضعیت‌ها</option>
            <option value="in_stock">موجود</option>
            <option value="low_stock">موجودی رو به کاهش</option>
            <option value="critical_stock">بحرانی</option>
            <option value="out_of_stock">ناموجود</option>
          </select>

          {/* Bulk Actions Placeholder Dropdown */}
          <select className="px-4 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white/70 focus:outline-none appearance-none pr-8">
            <option value="">عملیات گروهی انبار (Bulk)</option>
            <option value="increase_stock">افزایش موجودی دسته‌جمعی</option>
            <option value="decrease_stock">کاهش موجودی دسته‌جمعی</option>
            <option value="import">ورود اکسل موجودی (Import)</option>
            <option value="export">خروجی گزارش انبار (Export)</option>
            <option value="archive">انتقال به انبار آرشیو</option>
          </select>
        </div>
      </div>

      {/* لیست کارت‌های موجودی انبار (Stock Cards List) */}
      <div className="grid grid-cols-1 gap-4">
        {inventoryList.map(item => {
          const statusConfig = getStockStatusConfig(item.status);
          const isLowOrCritical = item.status === 'low_stock' || item.status === 'critical_stock';
          const isOutOfStock = item.status === 'out_of_stock';

          return (
            <div
              key={item.id}
              className={`p-5 bg-white/5 border rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors flex flex-col gap-4 ${isOutOfStock
                  ? 'border-red-500/30 bg-red-500/5'
                  : isLowOrCritical
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : 'border-white/10'
                }`}
            >
              {/* هدر کارت: عنوان محصول + Warehouse Badge + Status Badge */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} alt={item.productTitle} className="w-10 h-10 rounded-lg object-cover bg-black/50 border border-white/10" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xs text-white/40">عکس</div>
                  )}
                  <div>
                    <h3 className="text-base font-semibold text-white">{item.productTitle}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {/* Warehouse Badge */}
                      <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[11px] text-blue-400">
                        🏢 {item.warehouse}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${statusConfig.classes}`}>
                  {statusConfig.label}
                </span>
              </div>

              {/* بدنه کارت: کدهای شناسه، مقادیر تفکیک‌شده موجودی و هشدارهای هوشمند */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

                {/* بخش کدهای شناسه (SKU & Barcode) */}
                <div className="space-y-1 text-xs text-white/50">
                  <div><span className="text-white/30">کد SKU انبار:</span> <span className="font-mono text-white/80">{item.sku}</span></div>
                  {item.barcode && (
                    <div><span className="text-white/30">بارکد کالا:</span> <span className="font-mono text-white/80">{item.barcode}</span></div>
                  )}
                  {item.lastRestockDate && (
                    <div className="text-[11px] text-white/40 pt-1">
                      آخرین شارژ: {new Date(item.lastRestockDate).toLocaleDateString('fa-IR')}
                    </div>
                  )}
                </div>

                {/* تفکیک مقادیر موجودی (Current, Reserved, Available) */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">

                  {/* کل موجودی فیزیکی (Current Quantity) */}
                  <div className="flex-1 lg:flex-initial px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-center">
                    <span className="text-[11px] text-white/40 block">کل موجودی فیزیکی</span>
                    <span className="text-base font-bold text-white">{item.currentQuantity} عدد</span>
                  </div>

                  {/* موجودی رزرو شده (Reserved Quantity) */}
                  <div className="flex-1 lg:flex-initial px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-center">
                    <span className="text-[11px] text-white/40 block">در انتظار ارسال (رزرو)</span>
                    <span className="text-base font-bold text-amber-400">{item.reservedQuantity} عدد</span>
                  </div>

                  {/* موجودی قابل فروش (Available Quantity) */}
                  <div className="flex-1 lg:flex-initial px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                    <span className="text-[11px] text-emerald-400/70 block">قابل فروش فوری</span>
                    <span className="text-base font-bold text-emerald-400">{item.availableQuantity} عدد</span>
                  </div>

                </div>

                {/* دکمه‌های عملیاتی دستیابی سریع / تاریخچه (Placeholders) */}
                <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 border-white/5 pt-3 lg:pt-0">

                  {/* Inventory History Placeholder */}
                  <button className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs text-white/70 transition-colors">
                    📜 تاریخچه گردش
                  </button>

                  {/* Quick Adjust Stock Placeholder */}
                  <button className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs text-white/70 transition-colors">
                    ✏️ اصلاح سریع
                  </button>
                </div>

              </div>

              {/* نوار هشدار کمبود موجودی (Low Stock / Out of Stock Warning) */}
              {isOutOfStock && (
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
                  <span>⚠️</span>
                  <span><strong>هشدار اتمام موجودی:</strong> این کالا در فروشگاه غیرفعال شده است. لطفاً جهت فعال‌سازی مجدد انبار را شارژ کنید.</span>
                </div>
              )}

              {isLowOrCritical && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400 flex items-center gap-2">
                  <span>⚠️</span>
                  <span><strong>هشدار کسر موجودی:</strong> موجودی قابل فروش کمتر از آستانه مجاز ({item.lowStockThreshold} عدد) است.</span>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}