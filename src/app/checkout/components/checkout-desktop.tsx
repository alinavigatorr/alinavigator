'use client';

import React from 'react';
import { CheckoutSummary } from './shared/checkout-summary';
import { StepAddress } from './steps/step-address';
import { StepShipping } from './steps/step-shipping';
import { StepPayment } from './steps/step-payment';
import { StepReview } from './steps/step-review';
import { StepConfirmation } from './steps/step-confirmation';

export function CheckoutDesktop({ session, updateSession, nextStep, prevStep, completeOrder }: any) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pt-28 grid grid-cols-12 gap-10">
      <div className="col-span-8 bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-2xl">
        {session.step === 1 && <StepAddress data={session.address} onUpdate={(addr: any) => updateSession({ address: addr })} onNext={nextStep} />}
        {session.step === 2 && <StepShipping selected={session.shippingMethod} onSelect={(m: string) => updateSession({ shippingMethod: m })} onNext={nextStep} onPrev={prevStep} />}
        {session.step === 3 && <StepPayment selected={session.paymentMethod} onSelect={(p: string) => updateSession({ paymentMethod: p })} onNext={nextStep} onPrev={prevStep} />}
        {session.step === 4 && <StepReview session={session} onComplete={completeOrder} onPrev={prevStep} />}
        {session.step === 5 && <StepConfirmation />}
      </div>
      <div className="col-span-4">
        <CheckoutSummary />
      </div>
    </div>
  );
}