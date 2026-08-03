'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CheckoutAddress {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
}

export interface CheckoutSession {
  step: number;
  address: CheckoutAddress;
  shippingMethod: string;
  paymentMethod: string;
}

const DEFAULT_SESSION: CheckoutSession = {
  step: 1,
  address: {
    fullName: '',
    phone: '',
    province: '',
    city: '',
    address: '',
    postalCode: '',
  },
  shippingMethod: '',
  paymentMethod: '',
};

const STORAGE_KEY = 'alinavigator_checkout_session';

export function useCheckoutSession() {
  const [session, setSession] = useState<CheckoutSession>(DEFAULT_SESSION);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSession({ ...DEFAULT_SESSION, ...parsed });
      }
    } catch (e) {
      console.error('Error loading checkout session');
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  }, [session, isMounted]);

  const updateSession = useCallback((partial: Partial<CheckoutSession>) => {
    setSession((prev) => ({ ...prev, ...partial }));
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { session, updateSession, clearSession };
}
