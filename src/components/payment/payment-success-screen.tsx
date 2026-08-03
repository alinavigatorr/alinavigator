'use client';

import React from 'react';
import { ReceiptCard } from './receipt-card';

export function PaymentSuccessScreen() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 py-6">
      <ReceiptCard />
    </div>
  );
}