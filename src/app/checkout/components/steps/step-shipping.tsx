'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Zap, ArrowLeft, ArrowRight } from 'lucide-react';

interface StepShippingProps {
  selected: string;
  onSelect: (method: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

const shippingMethods = [
  {
    id: 'standard',
    title: 'ارسال عادی پستی',
    description: 'تحویل ۳ تا ۵ روز کاری در سراسر کشور',
    price: '۴۵,۰۰۰ تومان',
    icon: <Truck className="w-5 h-5 text-blue-400" />,
    badge: 'اقتصادی',
  },
  {
    id: 'express',
    title: 'ارسال سریع (پیک)',
    description: 'تحویل همان روز در تهران و شهرهای بزرگ',
    price: '۱۲۰,۰۰۰ تومان',
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    badge: 'سریع',
  },
  {
    id: 'free',
    title: 'ارسال رایگان',
    description: 'برای سفارش‌های بالای ۵,۰۰۰,۰۰۰ تومان',
    price: 'رایگان',
    icon: <Truck className="w-5 h-5 text-emerald-400" />,
    badge: 'رایگان',
  },
];

export function StepShipping({ selected, onSelect, onNext, onPrev }: StepShippingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20">
          <Truck className="w-5 h-5 text-[rgb(var(--primary))]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">روش ارسال</h2>
          <p className="text-xs text-white/40">نحوه ارسال سفارش خود را انتخاب کنید</p>
        </div>
      </div>

      <div className="space-y-3">
        {shippingMethods.map((method) => {
          const isSelected = selected === method.id;
          return (
            <div
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                isSelected
                  ? 'bg-[rgb(var(--primary))]/10 border-[rgb(var(--primary))] shadow-lg shadow-[rgb(var(--primary))]/5'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              <div
                className={`p-3 rounded-xl border ${
                  isSelected
                    ? 'bg-[rgb(var(--primary))]/20 border-[rgb(var(--primary))]/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {method.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{method.title}</h4>
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                      isSelected
                        ? 'bg-[rgb(var(--primary))] text-black font-bold'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {method.badge}
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">{method.description}</p>
                <span className="text-sm font-bold text-white mt-2 block">{method.price}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 bg-white/5 text-white/70 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:bg-white/10 active:scale-[0.98]"
        >
          <ArrowRight className="w-4 h-4" />
          مرحله قبل
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className="flex items-center gap-2 bg-[rgb(var(--primary))] text-black px-6 py-3 rounded-xl font-bold text-sm transition-all hover:bg-[rgb(var(--primary))]/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          مرحله بعد
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
