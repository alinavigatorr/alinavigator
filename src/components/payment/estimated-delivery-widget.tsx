'use client';

import React from 'react';
import { CalendarClock, Truck } from 'lucide-react';

export const EstimatedDeliveryWidget = React.memo(function EstimatedDeliveryWidget() {
  return (
    <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" aria-label="زمان تقریبی تحویل">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
          <CalendarClock className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm">زمان تقریبی تحویل</span>
          <span className="text-white/50 text-xs mt-1">پست پیشتاز - دارای قابلیت رهگیری</span>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
        <Truck className="w-4 h-4 text-[rgb(var(--primary))]" />
        <span className="text-white text-sm font-medium">۳ تا ۵ روز کاری</span>
      </div>
    </section>
  );
});