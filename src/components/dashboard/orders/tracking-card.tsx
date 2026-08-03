'use client';

import React from 'react';
import { Truck, ExternalLink } from 'lucide-react';

interface TrackingCardProps {
  trackingNumber: string;
  courier: string;
  estimatedDelivery: string;
}

export const TrackingCard = React.memo(function TrackingCard({ trackingNumber, courier, estimatedDelivery }: TrackingCardProps) {
  return (
    <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col gap-4" aria-label="اطلاعات ارسال">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm">پیگیری ارسال</h3>
          <p className="text-white/50 text-xs mt-0.5">پست پیشتاز ({courier})</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
          <span className="text-white/60 text-xs">کد رهگیری</span>
          <span className="text-white font-mono font-bold tracking-widest">{trackingNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/60 text-xs">زمان تقریبی تحویل</span>
          <span className="text-white font-medium">{estimatedDelivery}</span>
        </div>
      </div>

      <button className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/50">
        پیگیری در سایت پست <ExternalLink className="w-4 h-4" />
      </button>
    </section>
  );
});