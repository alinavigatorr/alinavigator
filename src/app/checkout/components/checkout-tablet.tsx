'use client';

import React from 'react';
import { StepAddress } from './steps/step-address';
import { StepShipping } from './steps/step-shipping';
import { StepPayment } from './steps/step-payment';
import { StepReview } from './steps/step-review';
import { StepConfirmation } from './steps/step-confirmation';
import { CheckoutSummary } from './shared/checkout-summary';

export function CheckoutTablet({ session, updateSession, nextStep, prevStep, completeOrder }: any) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 pt-24 space-y-8">
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
        {session.step === 1 && <StepAddress data={session.address} onUpdate={(addr: any) => updateSession({ address: addr })} onNext={nextStep} />}
        {session.step === 2 && <StepShipping selected={session.shippingMethod} onSelect={(m: string) => updateSession({ shippingMethod: m })} onNext={nextStep} onPrev={prevStep} />}
        {session.step === 3 && <StepPayment selected={session.paymentMethod} onSelect={(p: string) => updateSession({ paymentMethod: p })} onNext={nextStep} onPrev={prevStep} />}
        {session.step === 4 && <StepReview session={session} onComplete={completeOrder} onPrev={prevStep} />}
        {session.step === 5 && <StepConfirmation />}
      </div>
      <CheckoutSummary />
    </div>
  );
}