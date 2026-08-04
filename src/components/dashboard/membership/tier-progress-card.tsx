'use client';

import React from 'react';
import { useMembership } from '../../../contexts/MembershipContext';
import { useHistory } from '../../../contexts/HistoryContext'; // ADDED: اضافه شدن هوک تاریخچه
import { Award, Wallet, ArrowUpRight } from 'lucide-react';

export function TierProgressCard() {
  const { membership, isLoading: isMembershipLoading } = useMembership();
  const { 
    summary, 
    walletTransactions, 
    loyaltyLedger, 
    isLoading: isHistoryLoading 
  } = useHistory();

  // اگر دیتاها هنوز لود نشده‌اند چیزی رندر نمی‌کنیم (لودر اصلی در فایل والد نمایش داده می‌شود)
  if (isMembershipLoading || isHistoryLoading || !membership || !summary) {
    return null;
  }

  // ۱. محاسبه مقادیر داینامیک از زیرساخت History Ledger
  const availableBalance = summary.totalWalletBalance;
  
  const pendingBalance = walletTransactions
    .filter(tx => tx.status === 'PENDING')
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

  const currentPoints = summary.totalPointsAvailable;
  
  const lifetimeEarned = loyaltyLedger
    .filter(tx => tx.status === 'COMPLETED' && tx.type === 'EARN')
    .reduce((acc, curr) => acc + curr.points, 0);

  const totalCashback = summary.totalCashbackEarned;

  // استخراج واحد پولی (پیش‌فرض IRR)
  const currency = walletTransactions.length > 0 ? walletTransactions[0].currency : 'IRR';

  const formatCurrency = (amount: number, curr?: string) => {
    const safeAmount = typeof amount === 'number' ? amount : 0;
    const formatted = new Intl.NumberFormat('fa-IR').format(safeAmount);
    return curr === 'IRR' || !curr ? `${formatted} ریال` : `${formatted} ${curr}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. نوار پیشرفت ارتقای سطح (Tier Progress) */}
      <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl">
                <Award className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">مسیر پیشرفت وفاداری</h3>
                <p className="text-xs text-white/50">امتیازات و جایگاه شما در باشگاه مشتریان</p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">
              سطح فعلی: {membership.tier}
            </span>
          </div>

          {/* انیمیشن و نوار پیشرفت سطح بعدی */}
          <div className="my-6 p-5 rounded-2xl bg-black/30 border border-white/5">
            <div className="flex justify-between text-xs text-white/70 mb-2">
              <span className="font-semibold text-white">سطح فعلی: {membership.tier}</span>
              <span className="text-indigo-400 font-bold">۷۵٪ پیشرفت تا سطح Diamond</span>
            </div>
            <div className="w-full bg-white/10 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full w-3/4 transition-all duration-1000 shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
            </div>
            <div className="flex justify-between text-[11px] text-white/40 mt-2">
              <span>شروع پله</span>
              <span>هدف: سطح Diamond 💎</span>
            </div>
          </div>
        </div>

        {/* خلاصه امتیازات و کوین‌ها داینامیک */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-xs text-white/50 block mb-1">امتیاز فعلی</span>
            <span className="text-lg font-extrabold text-white">{currentPoints.toLocaleString('fa-IR')}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-xs text-white/50 block mb-1">مجموع کسب‌شده</span>
            <span className="text-lg font-extrabold text-emerald-400">{lifetimeEarned.toLocaleString('fa-IR')}</span>
          </div>
          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-xs text-white/50 block mb-1">ارزش کل کش‌بک</span>
            <span className="text-sm font-bold text-amber-400">{formatCurrency(totalCashback, currency)}</span>
          </div>
        </div>
      </div>

      {/* 2. خلاصه وضعیت مالی (Wallet Summary Quick Card) */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-2xl">
              <Wallet className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">کیف پول و موجودی</h3>
              <p className="text-xs text-white/50">دارایی مالی حساب کاربری</p>
            </div>
          </div>

          <div className="space-y-4 my-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-xs text-white/50 block mb-1">موجودی قابل استفاده</span>
              <span className="text-2xl font-black text-white">{formatCurrency(availableBalance, currency)}</span>
            </div>

            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
              <span className="text-white/60">موجودی در انتظار تایید:</span>
              <span className="font-bold text-white/90">{formatCurrency(pendingBalance, currency)}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
          <span>واحد پولی: تومان / ریال</span>
          <span className="text-emerald-400 flex items-center gap-1 font-medium">
            امن و فعال <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

    </div>
  );
}