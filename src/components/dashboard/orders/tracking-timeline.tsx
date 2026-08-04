'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { OrderStatus } from '../../../types/order';

interface TrackingTimelineProps {
  currentStatus: OrderStatus;
}

const TIMELINE_STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'PENDING', label: 'ثبت سفارش' },
  { status: 'CONFIRMED', label: 'تایید سفارش' },
  { status: 'PACKED', label: 'بسته‌بندی' },
  { status: 'SHIPPED', label: 'ارسال شده' },
  { status: 'OUT_FOR_DELIVERY', label: 'در حال تحویل' },
  { status: 'DELIVERED', label: 'تحویل شده' },
];

export const TrackingTimeline = React.memo(function TrackingTimeline({ currentStatus }: TrackingTimelineProps) {
  const isCancelled = currentStatus === 'CANCELLED' || currentStatus === 'RETURNED' || currentStatus === 'REFUNDED';
  const currentIndex = TIMELINE_STEPS.findIndex(step => step.status === currentStatus);
  const activeIndex = isCancelled ? -1 : (currentIndex === -1 ? 5 : currentIndex);

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8" aria-label="وضعیت ارسال">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-6 md:gap-0">
        
        {/* Background Line (Desktop) */}
        <div className="hidden md:block absolute top-5 left-8 right-8 h-1 bg-white/10 rounded-full" aria-hidden="true" />
        
        {/* Active Line (Desktop) */}
        {!isCancelled && (
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(activeIndex / (TIMELINE_STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden md:block absolute top-5 right-8 h-1 bg-[rgb(var(--primary))] rounded-full" 
            aria-hidden="true" 
            style={{ transformOrigin: "right" }}
          />
        )}

        {/* Steps */}
        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isCurrent = index === activeIndex;
          const isFuture = index > activeIndex;

          return (
            <div key={step.status} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 group">
              {/* Vertical Line for Mobile */}
              {index !== TIMELINE_STEPS.length - 1 && (
                <div className="md:hidden absolute top-10 right-5 w-0.5 h-10 bg-white/10" aria-hidden="true">
                  {index < activeIndex && !isCancelled && (
                    <div className="w-full h-full bg-[rgb(var(--primary))]" />
                  )}
                </div>
              )}

              {/* Step Circle */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isCancelled 
                    ? 'bg-red-400/10 border-red-400/50 text-red-400'
                    : isCompleted 
                      ? 'bg-[rgb(var(--primary))] border-[rgb(var(--primary))] text-[#0F0F13]' 
                      : isCurrent 
                        ? 'bg-white/10 border-[rgb(var(--primary))] text-[rgb(var(--primary))] ring-4 ring-[rgb(var(--primary))]/20' 
                        : 'bg-white/5 border-white/20 text-white/30'
                }`}
              >
                {isCancelled && isCurrent ? <X className="w-5 h-5" /> : (isCompleted ? <Check className="w-5 h-5" /> : <span className="text-xs font-bold">{index + 1}</span>)}
              </motion.div>

              {/* Step Label */}
              <div className="flex flex-col md:items-center">
                <span className={`text-sm font-bold transition-colors ${isCompleted || isCurrent ? 'text-white' : 'text-white/40'}`}>
                  {step.label}
                </span>
                {isCurrent && !isCancelled && (
                  <span className="text-[10px] text-[rgb(var(--primary))] mt-1 font-medium">مرحله فعلی</span>
                )}
                {isCancelled && isCurrent && (
                  <span className="text-[10px] text-red-400 mt-1 font-medium">لغو شده</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});