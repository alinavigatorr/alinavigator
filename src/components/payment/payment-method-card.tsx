'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, Truck, Landmark, Smartphone, Apple, CheckCircle2 } from 'lucide-react';
import { PaymentMethod } from '../../types/payment';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: (method: PaymentMethod) => void;
}

const IconMap: Record<string, React.ElementType> = {
  CreditCard, Wallet, Truck, Landmark, Smartphone, Apple
};

export const PaymentMethodCard = React.memo(function PaymentMethodCard({ method, isSelected, onSelect }: PaymentMethodCardProps) {
  const Icon = IconMap[method.icon] || CreditCard;

  return (
    <motion.div
      whileHover={method.isAvailable ? { y: -2 } : {}}
      whileTap={method.isAvailable ? { scale: 0.98 } : {}}
      onClick={() => method.isAvailable && onSelect(method)}
      role="radio"
      aria-checked={isSelected}
      aria-disabled={!method.isAvailable}
      tabIndex={method.isAvailable ? 0 : -1}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && method.isAvailable) {
          e.preventDefault();
          onSelect(method);
        }
      }}
      className={`relative p-4 rounded-2xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 ${
        !method.isAvailable 
          ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
          : isSelected
            ? 'bg-[rgb(var(--primary))]/10 border-[rgb(var(--primary))] ring-1 ring-[rgb(var(--primary))]'
            : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-[rgb(var(--primary))] text-[#08080A]' : 'bg-white/10 text-white/70'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col flex-1 gap-1">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-bold ${isSelected ? 'text-[rgb(var(--primary))]' : 'text-white'}`}>{method.name}</span>
            {isSelected && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <CheckCircle2 className="w-5 h-5 text-[rgb(var(--primary))]" />
              </motion.div>
            )}
            {!method.isAvailable && (
              <span className="text-[10px] bg-white/10 text-white/50 px-2 py-0.5 rounded-md font-medium">غیرفعال</span>
            )}
          </div>
          <span className="text-xs text-white/50">{method.description}</span>
        </div>
      </div>
    </motion.div>
  );
});