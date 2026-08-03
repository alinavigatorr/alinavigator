'use client';

import React, { useState } from 'react';
import { SellerWalletService } from '@/services/seller/wallet/seller-wallet-service';
import { WalletSummaryModel, WalletTransactionModel, WalletTransactionType } from '@/services/seller/wallet/seller-wallet-types';

export function WalletModule() {
  const [wallet] = useState<WalletSummaryModel>(SellerWalletService.getWalletSummary());
  const [transactions] = useState<WalletTransactionModel[]>(SellerWalletService.getRecentTransactions());

  // تابع کمکی برای ترجمه و استایل انواع تراکنش‌ها
  const getTransactionTypeConfig = (type: WalletTransactionType) => {
    switch (type) {
      case 'sale_income':
        return { label: 'درآمد فروش', color: 'text-emerald-400', bg: 'bg-emerald-500/10', sign: '+' };
      case 'refund':
        return { label: 'استرداد وجه', color: 'text-red-400', bg: 'bg-red-500/10', sign: '-' };
      case 'commission':
        return { label: 'کارمزد پلتفرم', color: 'text-amber-400', bg: 'bg-amber-500/10', sign: '-' };
      case 'settlement':
        return { label: 'تسویه حساب', color: 'text-blue-400', bg: 'bg-blue-500/10', sign: '-' };
      case 'adjustment':
        return { label: 'تعدیل حساب', color: 'text-purple-400', bg: 'bg-purple-500/10', sign: '±' };
      case 'bonus':
        return { label: 'پاداش', color: 'text-cyan-400', bg: 'bg-cyan-500/10', sign: '+' };
      case 'cashback':
        return { label: 'کش‌بک', color: 'text-emerald-400', bg: 'bg-emerald-500/10', sign: '+' };
      default:
        return { label: 'تراکنش مالی', color: 'text-white/70', bg: 'bg-white/5', sign: '' };
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر ماژول */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">کیف پول و امور مالی</h1>
          <p className="text-sm text-white/50 mt-1">مدیریت موجودی حساب، درخواست تسویه و مشاهده تاریخچه تراکنش‌ها.</p>
        </div>
        <div className="flex gap-2">
          {/* Request Settlement Placeholder Button */}
          <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            💳 درخواست تسویه حساب
          </button>
        </div>
      </div>

      {/* بخش کارت‌های خلاصه موجودی (Wallet Summary Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* موجودی قابل برداشت */}
        <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl backdrop-blur-md flex flex-col justify-between">
          <span className="text-xs text-emerald-400/80 font-medium">موجودی قابل برداشت فوری</span>
          <div className="mt-4">
            <span className="text-2xl font-bold text-emerald-400">{wallet.availableBalance.toLocaleString('fa-IR')}</span>
            <span className="text-xs text-emerald-400/70 mr-1">تومان</span>
          </div>
          <span className="text-[11px] text-emerald-400/60 mt-2 block">آماده برای واریز به شماره شبا</span>
        </div>

        {/* موجودی در انتظار تسویه */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col justify-between">
          <span className="text-xs text-white/50 font-medium">موجودی در انتظار تسویه</span>
          <div className="mt-4">
            <span className="text-2xl font-bold text-amber-400">{wallet.pendingBalance.toLocaleString('fa-IR')}</span>
            <span className="text-xs text-white/50 mr-1">تومان</span>
          </div>
          <span className="text-[11px] text-white/40 mt-2 block">حاصل از سفارشات روزهای اخیر</span>
        </div>

        {/* موجودی مسدود شده */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col justify-between">
          <span className="text-xs text-white/50 font-medium">موجودی مسدود شده</span>
          <div className="mt-4">
            <span className="text-2xl font-bold text-white">{wallet.blockedBalance.toLocaleString('fa-IR')}</span>
            <span className="text-xs text-white/50 mr-1">تومان</span>
          </div>
          <span className="text-[11px] text-white/40 mt-2 block">بابت تعهدات یا شکایات فعال</span>
        </div>

        {/* مجموع کش‌بک‌ها */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col justify-between">
          <span className="text-xs text-white/50 font-medium">مجموع پاداش کش‌بک</span>
          <div className="mt-4">
            <span className="text-2xl font-bold text-cyan-400">{wallet.totalCashback.toLocaleString('fa-IR')}</span>
            <span className="text-xs text-white/50 mr-1">تومان</span>
          </div>
          <span className="text-[11px] text-cyan-400/60 mt-2 block">پاداش‌های کمپین‌های فروش</span>
        </div>

      </div>

      {/* نوار ابزار تراکنش‌ها (Toolbar & Placeholders) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <h3 className="text-base font-semibold text-white">تاریخچه تراکنش‌های مالی اخیر</h3>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <select className="px-4 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white/70 focus:outline-none appearance-none">
            <option value="">همه انواع تراکنش</option>
            <option value="sale_income">درآمد فروش</option>
            <option value="settlement">تسویه حساب</option>
            <option value="refund">استرداد وجه</option>
          </select>
          <button className="px-4 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            📥 دانلود صورت‌حساب (Statement)
          </button>
        </div>
      </div>

      {/* لیست تراکنش‌ها (Transactions List) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden">
        <div className="divide-y divide-white/5">
          {transactions.map(trx => {
            const config = getTransactionTypeConfig(trx.type);
            const isPositive = trx.amount > 0;

            return (
              <div key={trx.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/5 transition-colors">

                {/* اطلاعات نوع تراکنش و توضیحات */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${config.bg} ${config.color}`}>
                    {config.sign}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{config.label}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${trx.status === 'success'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : trx.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                        {trx.status === 'success' ? 'موفق' : trx.status === 'pending' ? 'در انتظار' : 'ناموفق'}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mt-0.5">{trx.description}</p>
                    {trx.referenceId && (
                      <span className="text-[11px] text-white/30 font-mono mt-1 inline-block">مرجع: {trx.referenceId}</span>
                    )}
                  </div>
                </div>

                {/* مبلغ تراکنش و تاریخ */}
                <div className="flex sm:flex-col justify-between items-end w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                  <span className={`text-base font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{trx.amount.toLocaleString('fa-IR')} <span className="text-xs font-normal opacity-70">تومان</span>
                  </span>
                  <span className="text-xs text-white/40 sm:mt-1">
                    {new Date(trx.date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}