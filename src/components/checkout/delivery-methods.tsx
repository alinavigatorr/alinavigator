'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Zap, Store } from 'lucide-react';

export type DeliveryMethod = 'standard' | 'express' | 'pickup';

interface DeliveryProps {
  selected: DeliveryMethod;
  onChange: (method: DeliveryMethod) => void;
}

const methods = [
  { id: 'standard', title: 'ارسال استاندارد', desc: '۳ تا ۵ روز کاری', price: 'رایگان', icon: Truck, cost: 0 },
  { id: 'express', title: 'ارسال فوری (VIP)', desc: 'تحویل در همان روز', price: '۹۵,۰۰۰ تومان', icon: Zap, cost: 95000 },
  { id: 'pickup', title: 'دریافت حضوری', desc: 'از انبار مرکزی', price: 'رایگان', icon: Store, cost: 0 },
] as const;

export function DeliveryMethods({ selected, onChange }: DeliveryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white mb-4">روش ارسال</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="radiogroup" aria-label="انتخاب روش ارسال">
        {methods.map((method) => {
          const isSelected = selected === method.id;
          const Icon = method.icon;
          
          return (
            <div
              key={method.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onChange(method.id as DeliveryMethod)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onChange(method.id as DeliveryMethod)}
              className={`relative cursor-pointer rounded-2xl p-5 border transition-all duration-300 outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] ${
                isSelected 
                  ? 'bg-[rgb(var(--primary))]/10 border-[rgb(var(--primary))]/50' 
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="delivery-active"
                  className="absolute inset-0 rounded-2xl border-2 border-[rgb(var(--primary))] pointer-events-none"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-[rgb(var(--primary))]/20 text-[rgb(var(--primary))]' : 'bg-white/5 text-white/50'}`}>
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[rgb(var(--primary))]' : 'border-white/20'}`}>
                    {isSelected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-[rgb(var(--primary))]" />}
                  </div>
                </div>
                <div>
                  <h4 className={`text-sm font-bold mb-1 ${isSelected ? 'text-white' : 'text-white/80'}`}>{method.title}</h4>
                  <p className="text-xs text-white/50 mb-3">{method.desc}</p>
                  <span className={`text-sm font-black ${isSelected ? 'text-[rgb(var(--primary))]' : 'text-white/60'}`}>{method.price}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}