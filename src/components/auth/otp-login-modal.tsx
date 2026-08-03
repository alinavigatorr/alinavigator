'use client';

import React, { useState } from 'react';
import { Smartphone, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

interface OtpLoginProps {
  onSuccess: (phone: string) => void;
}

export function OtpLoginModal({ onSuccess }: OtpLoginProps) {
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('لطفاً شماره موبایل معتبر وارد کنید (مثلا 09123456789)');
      return;
    }
    setError('');
    setLoading(true);
    // شبیه‌سازی ارسال درخواست به API پیامکی
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('کد تایید ۴ یا ۶ رقمی را وارد کنید');
      return;
    }
    setError('');
    setLoading(true);
    // شبیه‌سازی بررسی کد OTP و ساخت/ورود پروفایل کاربر
    setTimeout(() => {
      setLoading(false);
      onSuccess(phone);
    }, 1000);
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md mx-auto shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[rgb(var(--primary))]">
          {step === 'PHONE' ? <Smartphone className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
        </div>
        <h2 className="text-xl font-extrabold text-white">
          {step === 'PHONE' ? 'ورود / ثبت‌نام سریع' : 'تایید شماره موبایل'}
        </h2>
        <p className="text-xs text-white/50 mt-1">
          {step === 'PHONE' 
            ? 'برای ادامه شماره موبایل خود را وارد کنید' 
            : `کد تایید ارسال شده به شماره ${phone} را وارد کنید`}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 text-center">
          {error}
        </div>
      )}

      {step === 'PHONE' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">شماره موبایل</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09123456789"
              dir="ltr"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white text-center tracking-wider outline-none focus:border-[rgb(var(--primary))]"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[rgb(var(--primary))] text-black font-bold py-3.5 rounded-xl text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>دریافت کد تایید</span> <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">کد تایید پیامک شده</label>
            <input 
              type="text" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="1234"
              dir="ltr"
              maxLength={6}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white text-center tracking-widest outline-none focus:border-[rgb(var(--primary))]"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[rgb(var(--primary))] text-black font-bold py-3.5 rounded-xl text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>تایید و ورود به سایت</span>}
          </button>
          <button 
            type="button" 
            onClick={() => setStep('PHONE')}
            className="w-full text-xs text-white/40 hover:text-white transition-colors py-2"
          >
            ویرایش شماره موبایل
          </button>
        </form>
      )}
    </div>
  );
}