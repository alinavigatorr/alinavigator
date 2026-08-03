'use client';

import React from 'react';
import { CheckCircle2, Package, Truck, Home } from 'lucide-react';

export const OrderTimeline = React.memo(function OrderTimeline() {
  const steps = [
    { id: 1, label: 'ثبت سفارش', icon: CheckCircle2, status: 'active' },
    { id: 2, label: 'آماده‌سازی', icon: Package, status: 'pending' },
    { id: 3, label: 'ارسال', icon: Truck, status: 'pending' },
    { id: 4, label: 'تحویل', icon: Home, status: 'pending' },
  ];

  return (
    <div className="w-full mt-4 bg-white/5 border border-white/5 rounded-xl p-4" aria-label="زمان‌بندی ارسال سفارش">
      <h3 className="text-white/70 font-medium text-xs mb-6 text-center">وضعیت سفارش شما</h3>
      
      <div className="flex items-center justify-between relative px-4 sm:px-8">
        {/* خط پس‌زمینه */}
        <div className="absolute left-10 right-10 top-5 -translate-y-1/2 h-[2px] bg-white/10 z-0"></div>
        
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = step.status === 'active';
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-[rgb(var(--primary))] text-black shadow-[0_0_15px_rgba(var(--primary),0.3)]' 
                    : 'bg-[#1a1a24] text-white/30 border border-white/10'
                }`}
                // نکته: کد #1a1a24 برای هماهنگی با رنگ پس زمینه RGB سایت است تا خط زیرین را کاور کند
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] sm:text-xs font-medium text-center absolute -bottom-6 w-20 ${
                isActive ? 'text-[rgb(var(--primary))]' : 'text-white/40'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-8"></div> {/* فاصله برای جا دادن متن‌های absolute */}
    </div>
  );
});