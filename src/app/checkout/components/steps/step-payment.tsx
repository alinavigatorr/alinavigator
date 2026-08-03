'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ArrowLeft, ArrowRight } from 'lucide-react';
import { PaymentMethodsSection } from '@/components/checkout/payment-methods-section';
import { useCart } from '@/contexts/CartContext';

interface StepPaymentProps {
  selected: string;
  onSelect: (method: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function StepPayment({ selected, onSelect, onNext, onPrev }: StepPaymentProps) {
  const { subtotal } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20">
          <CreditCard className="w-5 h-5 text-[rgb(var(--primary))]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">روش پرداخت</h2>
          <p className="text-xs text-white/40">روش پرداخت مورد نظر خود را انتخاب کنید</p>
        </div>
      </div>

      <PaymentMethodsSection
        selectedMethod={selected}
        onSelectMethod={onSelect}
        totalAmount={subtotal}
      />

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
