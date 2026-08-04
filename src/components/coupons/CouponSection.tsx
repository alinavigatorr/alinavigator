'use client';

import React, { useState } from 'react';
import { CouponResult } from '../../domain/coupons/coupon-types';
import { couponService } from '../../services/coupons/coupon-service';

interface CouponSectionProps {
  cartSubtotal: number;
  userId?: string;
  onCouponApplied: (result: CouponResult | null) => void;
}

export function CouponSection({ cartSubtotal, userId = 'user-default', onCouponApplied }: CouponSectionProps) {
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<CouponResult | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsLoading(true);
    try {
      const result = await couponService.validateAndApply({
        couponCode: couponCode.trim(),
        cartSubtotal,
        userId
      });

      setCurrentResult(result);
      if (result.isValid) {
        onCouponApplied(result);
      } else {
        onCouponApplied(null);
      }
    } catch (error) {
      console.error('[CouponSection] Error applying coupon:', error);
      setCurrentResult({
        isValid: false,
        discountAmount: 0,
        reason: 'NOT_FOUND',
        message: 'خطایی در اعمال کد تخفیف رخ داد.'
      });
      onCouponApplied(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCurrentResult(null);
    onCouponApplied(null);
  };

  return (
    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <svg className="w-4 h-4 text-[rgb(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          کد تخفیف و هدایا
        </h4>
        <span className="text-xs text-white/40">پیشنهاد: WELCOME20 یا FLAT50K</span>
      </div>

      {currentResult?.isValid ? (
        <div className="p-3.5 bg-[rgb(var(--success))]/10 border border-[rgb(var(--success))]/30 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[rgb(var(--success))]/20 flex items-center justify-center text-[rgb(var(--success))]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white font-mono">{currentResult.coupon?.code}</span>
                <span className="text-[10px] bg-[rgb(var(--success))]/20 text-[rgb(var(--success))] px-2 py-0.5 rounded-full font-medium">فعال</span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                {currentResult.message} ({currentResult.discountAmount.toLocaleString('fa-IR')} تومان تخفیف)
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-xs text-white/50 hover:text-[rgb(var(--error))] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5"
          >
            حذف
          </button>
        </div>
      ) : (
        <form onSubmit={handleApplyCoupon} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="مثال: WELCOME20"
              className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[rgb(var(--primary))] uppercase transition-colors"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !couponCode.trim()}
            className="px-6 py-2.5 bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/90 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(var(--primary),0.2)] whitespace-nowrap flex items-center justify-center min-w-[100px]"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'اعمال کد'
            )}
          </button>
        </form>
      )}

      {currentResult && !currentResult.isValid && (
        <div className="p-3 bg-[rgb(var(--error))]/10 border border-[rgb(var(--error))]/30 text-[rgb(var(--error))] text-xs rounded-xl flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {currentResult.message}
        </div>
      )}
    </div>
  );
}