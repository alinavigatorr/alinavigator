'use client';

import React, { useState } from 'react';
import { ReturnReason, RefundType, ReturnResult } from '../../domain/returns/return-types';
import { returnService } from '../../services/returns/return-service';

interface ReturnSectionProps {
  orderId: string;
  orderStatus: string;
  deliveryDate?: string;
  isDigitalProduct?: boolean;
}

export function ReturnSection({ 
  orderId, 
  orderStatus, 
  deliveryDate, 
  isDigitalProduct = false 
}: ReturnSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [evaluation, setEvaluation] = useState<ReturnResult | null>(null);
  
  // Form State
  const [reason, setReason] = useState<ReturnReason>('damaged_item');
  const [refundType, setRefundType] = useState<RefundType>('original_payment_method');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Map application order status to Engine context status
  const normalizedStatus = (orderStatus.toLowerCase() as any) || 'pending';

  const handleInitiateReturn = () => {
    // 1. Evaluate eligibility via Returns Engine Service
    const result = returnService.evaluateReturnRequest(7, { // 7 days return window
      orderStatus: normalizedStatus,
      orderDeliveryDate: deliveryDate,
      isDigitalProduct,
      hasActiveReturnForOrderItem: false,
    });
    
    setEvaluation(result);
    setIsExpanded(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // شبیه‌سازی ارسال به سرور
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1500);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setEvaluation(null);
    setSubmitSuccess(false);
    setDescription('');
  };

  // --- Render Helpers --- //
  
  const reasonLabels: Record<ReturnReason, string> = {
    damaged_item: 'کالا آسیب دیده است',
    wrong_item: 'کالای اشتباه ارسال شده',
    missing_parts: 'قطعات ناقص است',
    defective: 'کالا معیوب است / کار نمی‌کند',
    changed_mind: 'از خرید منصرف شدم',
    late_delivery: 'تاخیر در ارسال',
    other: 'دلایل دیگر'
  };

  // 1. Success State (After Form Submission)
  if (submitSuccess) {
    return (
      <div className="p-6 bg-[rgb(var(--success))]/10 border border-[rgb(var(--success))]/30 rounded-2xl backdrop-blur-md flex flex-col items-center justify-center text-center gap-3 animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 rounded-full bg-[rgb(var(--success))]/20 flex items-center justify-center text-[rgb(var(--success))]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h4 className="text-lg font-bold text-white">درخواست مرجوعی ثبت شد</h4>
          <p className="text-sm text-white/70 mt-1">
            درخواست شما با موفقیت در وضعیت <span className="text-[rgb(var(--success))] font-medium">"در انتظار بررسی"</span> قرار گرفت. نتیجه از طریق پیامک اطلاع‌رسانی خواهد شد.
          </p>
        </div>
        <button 
          onClick={handleCancel}
          className="mt-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-xl transition-colors"
        >
          بازگشت به جزئیات سفارش
        </button>
      </div>
    );
  }

  // 2. Default State (Collapsed)
  if (!isExpanded) {
    return (
      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex items-center justify-between group">
        <div>
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-white/50 group-hover:text-[rgb(var(--primary))] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
            </svg>
            خدمات پس از فروش و مرجوعی
          </h4>
          <p className="text-xs text-white/50 mt-1">ثبت درخواست بازگشت کالا تا ۷ روز پس از تحویل</p>
        </div>
        <button 
          onClick={handleInitiateReturn}
          className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap"
        >
          ثبت درخواست مرجوعی
        </button>
      </div>
    );
  }

  // 3. Error State (Not Eligible)
  if (evaluation && !evaluation.isAllowed) {
    return (
      <div className="p-5 bg-[rgb(var(--error))]/10 border border-[rgb(var(--error))]/30 rounded-2xl backdrop-blur-md flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[rgb(var(--error))]/20 text-[rgb(var(--error))]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[rgb(var(--error))]">امکان ثبت مرجوعی وجود ندارد</h4>
            <p className="text-sm text-white/70 mt-1">{evaluation.message}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={handleCancel} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-xl transition-colors">
            بستن
          </button>
        </div>
      </div>
    );
  }

  // 4. Form State (Eligible)
  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[rgb(var(--success))] animate-pulse"></span>
            ثبت درخواست مرجوعی
          </h3>
          <p className="text-sm text-[rgb(var(--success))] mt-1">{evaluation?.message}</p>
        </div>
        <button onClick={handleCancel} className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Reason Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">دلیل مرجوعی</label>
          <select 
            value={reason} 
            onChange={(e) => setReason(e.target.value as ReturnReason)}
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[rgb(var(--primary))] transition-colors appearance-none cursor-pointer"
          >
            {(Object.keys(reasonLabels) as ReturnReason[]).map(key => (
              <option key={key} value={key} className="bg-gray-900">{reasonLabels[key]}</option>
            ))}
          </select>
        </div>

        {/* Refund/Replacement Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">نحوه جبران خسارت</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${refundType === 'original_payment_method' ? 'bg-[rgb(var(--primary))]/10 border-[rgb(var(--primary))]' : 'bg-black/20 border-white/10 hover:border-white/20'}`}>
              <input 
                type="radio" 
                name="refundType" 
                value="original_payment_method" 
                checked={refundType === 'original_payment_method'} 
                onChange={() => setRefundType('original_payment_method')}
                className="w-4 h-4 text-[rgb(var(--primary))] focus:ring-[rgb(var(--primary))] bg-transparent border-white/30" 
              />
              <span className="text-sm text-white">بازگشت وجه به حساب مبدا</span>
            </label>
            <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${refundType === 'store_credit' ? 'bg-[rgb(var(--primary))]/10 border-[rgb(var(--primary))]' : 'bg-black/20 border-white/10 hover:border-white/20'}`}>
              <input 
                type="radio" 
                name="refundType" 
                value="store_credit" 
                checked={refundType === 'store_credit'} 
                onChange={() => setRefundType('store_credit')}
                className="w-4 h-4 text-[rgb(var(--primary))] focus:ring-[rgb(var(--primary))] bg-transparent border-white/30" 
              />
              <span className="text-sm text-white">شارژ کیف پول (سریع‌تر)</span>
            </label>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">توضیحات تکمیلی (اختیاری)</label>
          <textarea 
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="لطفاً مشکل را به صورت کامل شرح دهید..."
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[rgb(var(--primary))] transition-colors resize-none"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
          <button 
            type="button" 
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            انصراف
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/90 text-white text-sm font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(var(--primary),0.2)] flex items-center min-w-[120px] justify-center disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'ثبت نهایی درخواست'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}