'use client';

import React from 'react';
import { useMembership } from '../../../contexts/MembershipContext';
import { Crown, ShieldCheck, Calendar, Sparkles } from 'lucide-react';

export function MembershipCard() {
  const { membership, isLoading } = useMembership();

  if (isLoading || !membership) {
    return null;
  }

  // محاسبه روزهای باقی‌مانده از اشتراک
  const calculateRemainingDays = (expiresAt?: string) => {
    if (!expiresAt) return 0;
    const diff = new Date(expiresAt).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const remainingDays = calculateRemainingDays(membership.expiresAt);

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'نامشخص';
    return new Date(isoString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-between group">
      
      {/* افکت نوری پس‌زمینه */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/30 transition-all duration-500"></div>
      <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
        <Crown className="w-32 h-32 text-white" />
      </div>

      <div className="z-10">
        {/* هدر کارت: بج و وضعیت */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 border border-yellow-400/30 rounded-2xl">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <span className="text-xs text-white/50 block">کارت عضویت ویژه</span>
              <h3 className="text-2xl font-black text-white tracking-wide">AliNavigator Club</h3>
            </div>
          </div>

          <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border backdrop-blur-md ${
            membership.status === 'ACTIVE' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {membership.status === 'ACTIVE' ? 'اشتراک فعال' : 'غیرفعال'}
          </span>
        </div>

        {/* سطح اشتراک (Tier Badge) */}
        <div className="mb-6 flex items-baseline gap-2">
          <span className="text-sm text-white/60">سطح فعلی:</span>
          <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400">
            {membership.tier} Membership
          </span>
        </div>
      </div>

      {/* فوتر کارت: تاریخ انقضا و روزهای باقی‌مانده */}
      <div className="z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-white/70">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span className="text-xs">انقضا: <strong className="text-white">{formatDate(membership.expiresAt)}</strong></span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-medium text-white/90">
            {remainingDays} روز باقی‌مانده تا تمدید
          </span>
        </div>
      </div>

    </div>
  );
}