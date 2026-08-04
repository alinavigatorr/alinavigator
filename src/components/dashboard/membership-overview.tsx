'use client';

import React from 'react';
import { useMembership } from '../../contexts/MembershipContext';
import { useHistory } from '../../contexts/HistoryContext'; // ADDED: هوک تاریخچه
import { Loader2, History, ArrowUpRight } from 'lucide-react';
import { MembershipCard } from './membership/membership-card';
import { TierProgressCard } from './membership/tier-progress-card';
import { MembershipBenefits } from './membership/membership-benefits';

export function MembershipOverview() {
  // جدا کردن استیت‌های لودینگ و ارور برای هر دو Context
  const { isLoading: isMembershipLoading, error: membershipError } = useMembership();
  const { loyaltyLedger, isLoading: isHistoryLoading, error: historyError } = useHistory();

  // ترکیب وضعیت‌ها
  const isLoading = isMembershipLoading || isHistoryLoading;
  const error = membershipError || historyError;

  // نمایش وضعیت بارگذاری (Skeleton / Spinner)
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl w-full">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
        <span className="text-white/70 font-medium">در حال بارگذاری اطلاعات پنل و تاریخچه تراکنش‌ها...</span>
      </div>
    );
  }

  // نمایش خطا
  if (error) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-400 w-full text-center">
        {error}
      </div>
    );
  }

  const formatDate = (timestampOrIso?: string | number) => {
    if (!timestampOrIso) return 'نامشخص';
    const date = typeof timestampOrIso === 'number' ? new Date(timestampOrIso) : new Date(timestampOrIso);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // خواندن ۵ تراکنش اخیر از loyaltyLedger (که داینامیک از HistoryContext می‌آید)
  const latestRewards = loyaltyLedger.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      
      {/* 1. کارت عضویت پرمیوم و وضعیت اصلی */}
      <div className="grid grid-cols-1">
        <MembershipCard />
      </div>

      {/* 2. نوار پیشرفت سطح و خلاصه کیف پول */}
      <TierProgressCard />

      {/* 3. گرید مزایا (فعال و قفل‌شده) به همراه تاریخچه تراکنش‌ها */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* مزایا (۲ ستون) */}
        <div className="lg:col-span-2 flex flex-col">
          <MembershipBenefits />
        </div>

        {/* آخرین تراکنش‌های پاداش (۱ ستون) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-2xl">
                <History className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">تاریخچه پاداش‌ها</h3>
                <p className="text-xs text-white/50">آخرین امتیازات کسب‌شده</p>
              </div>
            </div>

            {latestRewards.length === 0 ? (
              <p className="text-xs text-white/40 text-center py-12">تراکنشی ثبت نشده است.</p>
            ) : (
              <div className="space-y-3">
                {latestRewards.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all text-xs">
                    <div>
                      <p className="font-semibold text-white mb-1">{tx.description || 'پاداش وفاداری'}</p>
                      <p className="text-[10px] text-white/40">{formatDate(tx.createdAt)}</p>
                    </div>
                    <div className={`flex items-center gap-1 font-bold px-2.5 py-1 rounded-lg ${
                      tx.type === 'EARN' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {/* اضافه کردن پشتیبانی برای EXPIRE علاوه بر REDEEM */}
                      <ArrowUpRight className={`w-3.5 h-3.5 ${tx.type === 'REDEEM' || tx.type === 'EXPIRE' ? 'rotate-180' : ''}`} />
                      <span>{tx.type === 'EARN' ? '+' : '-'}{tx.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <span className="text-[11px] text-white/40">نمایش ۵ تراکنش اخیر باشگاه مشتریان</span>
          </div>
        </div>

      </div>

    </div>
  );
}