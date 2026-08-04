'use client';

import React from 'react';
import { StepAddress } from './steps/step-address';
import { StepShipping } from './steps/step-shipping';
import { StepPayment } from './steps/step-payment';
import { StepReview } from './steps/step-review';
import { StepConfirmation } from './steps/step-confirmation';

export function CheckoutMobile({ session, updateSession, nextStep, prevStep, completeOrder }: any) {
  return (
    <div className="px-4 py-6 pt-20 space-y-4 pb-24">
      {/* Mini Top Sticky Summary Bar for Mobile */}
      {session.step < 5 && (
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] text-white/40 block">مبلغ قابل پرداخت</span>
            <span className="text-base font-extrabold text-white">۱۷,۱۱۳,۰۰۰ تومان</span>
          </div>
          <div className="text-xs font-bold text-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10 px-3 py-1.5 rounded-xl">
            مرحله {session.step} از ۴
          </div>
        </div>
      )}

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-xl">
        {session.step === 1 && <StepAddress data={session.address} onUpdate={(addr: any) => updateSession({ address: addr })} onNext={nextStep} />}
        {session.step === 2 && <StepShipping selected={session.shippingMethod} onSelect={(m: string) => updateSession({ shippingMethod: m })} onNext={nextStep} onPrev={prevStep} />}
        {session.step === 3 && <StepPayment selected={session.paymentMethod} onSelect={(p: string) => updateSession({ paymentMethod: p })} onNext={nextStep} onPrev={prevStep} />}
        {session.step === 4 && <StepReview session={session} onComplete={completeOrder} onPrev={prevStep} />}
        {session.step === 5 && <StepConfirmation />}
      </div>
    </div>
  );
}