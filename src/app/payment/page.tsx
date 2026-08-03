'use client';

import React, { useEffect } from 'react';
import { PaymentProvider, usePayment } from '../../contexts/PaymentContext';
import { PaymentLayout } from '../../components/payment/payment-layout';
import { PaymentMethodSelector } from '../../components/payment/payment-method-selector';
import { BillingAddressCard } from '../../components/payment/billing-address-card';
import { CouponCard } from '../../components/payment/coupon-card';
import { PaymentSummaryCard } from '../../components/payment/payment-summary-card';
import { ReviewOrderSection } from '../../components/payment/review-order-section';
import { PaymentSuccessScreen } from '../../components/payment/payment-success-screen';
import { PaymentFailureScreen } from '../../components/payment/payment-failure-screen';
import { PaymentProcessingOverlay } from '../../components/payment/payment-processing-overlay';
import { mockBillingAddress } from '../../lib/mocks/payments';

function PaymentPageContent() {
  const { setBillingInformation, validationState, status } = usePayment();

  useEffect(() => {
    setBillingInformation(mockBillingAddress);
  }, [setBillingInformation]);

  // نمایش صفحات اختصاصی موفقیت یا خطا بدون رندر کردن فرم‌ها
  if (status === 'SUCCESS') return <PaymentSuccessScreen />;
  if (status === 'FAILED') return <PaymentFailureScreen />;

  return (
    <div className="relative">
      {/* اوورلی پردازش که در حالت PROCESSING روی کل فرم قرار می‌گیرد */}
      {status === 'PROCESSING' && <PaymentProcessingOverlay />}
      
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-300 ${status === 'PROCESSING' ? 'opacity-50 blur-[2px] pointer-events-none select-none' : 'opacity-100'}`}>
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {validationState.isMethodSelected && validationState.isBillingComplete ? (
            <ReviewOrderSection />
          ) : (
            <>
              <PaymentMethodSelector />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BillingAddressCard />
                <CouponCard />
              </div>
            </>
          )}

        </div>
        <div>
          <PaymentSummaryCard />
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <PaymentProvider initialTotal={14500000}>
      <PaymentLayout>
        <PaymentPageContent />
      </PaymentLayout>
    </PaymentProvider>
  );
}