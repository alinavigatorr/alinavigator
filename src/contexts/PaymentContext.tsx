'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { PaymentMethod, BillingAddress, Coupon, PaymentSummary } from '../types/payment';
import { PaymentStatus } from '../services/payment/types/payment-types';
import { PaymentAdapter } from '../services/payment/adapters/payment-adapter';
import { SimulationAdapter } from '../services/payment/adapters/simulation-adapter';
import { defaultSimulationConfig } from '../services/payment/simulation/payment-simulation-config';

interface PaymentValidationState {
  isMethodSelected: boolean;
  isBillingComplete: boolean;
  isConfirmed: boolean;
  canProceed: boolean;
}

interface PaymentContextType {
  selectedMethod: PaymentMethod | null;
  setSelectedMethod: (method: PaymentMethod | null) => void;
  billingInformation: BillingAddress | null;
  setBillingInformation: (billing: BillingAddress | null) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  paymentSummary: PaymentSummary;
  validationState: PaymentValidationState;
  
  isConfirmed: boolean;
  setIsConfirmed: (val: boolean) => void;
  orderNotes: string;
  setOrderNotes: (val: string) => void;
  
  status: PaymentStatus;
  processPayment: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children, initialTotal = 0 }: { children: React.ReactNode, initialTotal?: number }) {
  // PaymentContext ONLY knows the PaymentAdapter interface.
  // We inject SimulationAdapter here, but it can be swapped for StripeAdapter later.
  const adapter: PaymentAdapter = useMemo(() => new SimulationAdapter(defaultSimulationConfig), []);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [billingInformation, setBillingInformation] = useState<BillingAddress | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);

  useEffect(() => {
    // Subscribe to state changes emitted by the adapter
    const unsubscribe = adapter.subscribe((newState) => {
      setStatus(newState);
    });
    return unsubscribe;
  }, [adapter]);

  const paymentSummary = useMemo(() => {
    const subtotal = initialTotal;
    const shipping = 50000;
    const tax = subtotal * 0.09;
    const discount = appliedCoupon?.isValid ? appliedCoupon.discountAmount : 0;
    const total = Math.max(0, subtotal + shipping + tax - discount);
    return { subtotal, shipping, tax, discount, total };
  }, [initialTotal, appliedCoupon]);

  const applyCoupon = useCallback(async (code: string) => {
    if (code === 'DISCOUNT20') {
      setAppliedCoupon({ code, discountAmount: 200000, isValid: true, message: 'کد تخفیف اعمال شد' });
    } else {
      setAppliedCoupon({ code, discountAmount: 0, isValid: false, message: 'کد تخفیف نامعتبر است' });
    }
  }, []);

  const removeCoupon = useCallback(() => setAppliedCoupon(null), []);

  const validationState = useMemo(() => {
    const isMethodSelected = !!selectedMethod;
    const isBillingComplete = !!billingInformation?.fullAddress && !!billingInformation?.phone;
    const canProceed = isMethodSelected && isBillingComplete && isConfirmed;
    return { isMethodSelected, isBillingComplete, isConfirmed, canProceed };
  }, [selectedMethod, billingInformation, isConfirmed]);

  const processPayment = useCallback(async () => {
    if (!validationState.canProceed) return;

    const request = {
      orderId: `ORD-FRONT-${Date.now()}`,
      amount: paymentSummary.total,
      customerInfo: {
        fullName: billingInformation?.fullName || 'Guest',
        phone: billingInformation?.phone || '00000000000'
      }
    };

    let result;
    if (status === PaymentStatus.FAILED || status === PaymentStatus.TIMEOUT) {
      result = await adapter.retryPayment(request);
    } else {
      result = await adapter.startPayment(request);
    }

    if (!result.success) {
      console.error('Adapter returned an error:', result.error);
    }
  }, [adapter, validationState.canProceed, paymentSummary.total, billingInformation, status]);

  const value = useMemo(() => ({
    selectedMethod, setSelectedMethod,
    billingInformation, setBillingInformation,
    appliedCoupon, applyCoupon, removeCoupon,
    paymentSummary, validationState,
    isConfirmed, setIsConfirmed,
    orderNotes, setOrderNotes,
    status, processPayment
  }), [
    selectedMethod, billingInformation, appliedCoupon, applyCoupon, removeCoupon, 
    paymentSummary, validationState, isConfirmed, orderNotes, status, processPayment
  ]);

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) throw new Error('usePayment must be used within a PaymentProvider');
  return context;
};