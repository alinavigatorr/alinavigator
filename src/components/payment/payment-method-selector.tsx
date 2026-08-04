'use client';

import React from 'react';
import { usePayment } from '../../contexts/PaymentContext';
import { mockPaymentMethods } from '../../lib/mocks/payments';
import { PaymentMethodCard } from './payment-method-card';

export function PaymentMethodSelector() {
  const { selectedMethod, setSelectedMethod } = usePayment();

  return (
    <section className="flex flex-col gap-4" role="radiogroup" aria-label="انتخاب روش پرداخت">
      <h2 className="text-lg font-bold text-white tracking-tight">روش پرداخت</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockPaymentMethods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            isSelected={selectedMethod?.id === method.id}
            onSelect={setSelectedMethod}
          />
        ))}
      </div>
    </section>
  );
}