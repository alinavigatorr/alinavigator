'use client';

import React from 'react';
import { useMembership } from '../../../contexts/MembershipContext';
import { ShieldCheck, CheckCircle2, Lock, Sparkles } from 'lucide-react';

export function MembershipBenefits() {
  const { membership, isLoading } = useMembership();

  if (isLoading || !membership) {
    return null;
  }

  // مزایای قفل‌شده نمونه برای نمایش جذابیت سطوح بالاتر (Mock Locked Benefits)
  const lockedBenefits = [
    { id: 'lock-1', title: 'ارسال رایگان بدون محدودیت مبلغ', description: 'مخصوص اعضای سطح Diamond و VIP', tierRequired: 'Diamond' },
    { id: 'lock-2', title: 'دسترسی زودهنگام به کالاها و حراجژها', description: '۴۸ ساعت زودتر از عموم کاربران', tierRequired: 'VIP' }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
      <div>
        {/* هدر بخش مزایا */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">مزایای باشگاه مشتریان</h3>
              <p className="text-xs text-white/50">امکانات اختصاصی سطح اشتراک شما</p>
            </div>
          </div>
          <span className="text-xs text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
            سطح {membership.tier}
          </span>
        </div>

        {/* لیست مزایای فعال */}
        <div className="space-y-4 mb-8">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">مزایای فعال شما</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {membership.benefits.map((benefit) => (
              <div 
                key={benefit.id} 
                className={`flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-all ${
                  benefit.isActive ? 'hover:border-purple-500/30 hover:bg-white/[0.04]' : 'opacity-40'
                }`}
              >
                <div className="mt-0.5 p-1 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{benefit.title}</p>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* لیست مزایای قفل‌شده (Locked Benefits) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">مزایای سطوح بالاتر</h4>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedBenefits.map((lockBenefit) => (
              <div 
                key={lockBenefit.id} 
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none"></div>
                <div className="mt-0.5 p-1 rounded-lg bg-white/5 text-white/40 flex-shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white/70">{lockBenefit.title}</p>
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-medium">
                      {lockBenefit.tierRequired}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-1 leading-relaxed">{lockBenefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}