'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AuthInput } from '../../../components/auth/auth-input';
import { Loader2, Smartphone, Lock } from 'lucide-react';

const loginSchema = z.object({
  identifier: z.string().min(1, 'وارد کردن ایمیل یا نام کاربری الزامی است'),
  password: z.string().min(1, 'رمز عبور الزامی است'),
  rememberMe: z.boolean().optional(),
});

const otpSchema = z.object({
  phone: z.string().regex(/^09[0-9]{9}$/, 'فرمت شماره موبایل نامعتبر است (مثال: 09123456789)'),
  code: z.string().optional(),
});

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [isLoading, setIsLoading] = useState(false);
  
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const passwordForm = useForm({
    resolver: zodResolver(loginSchema),
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
  });

  const handleSendOtp = async () => {
    const phone = otpForm.getValues('phone');
    if (!phone || phone.length !== 11) {
      otpForm.setError('phone', { message: 'لطفاً شماره موبایل معتبر ۱۰ یا ۱۱ رقمی وارد کنید' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setCountdown(120);
      setCanResend(false);
    }, 1200);
  };

  const handleGoogleLogin = () => {
    console.log('Redirecting to Google OAuth Provider...');
  };

  const onSubmitPassword = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Login with password:', data);
      setIsLoading(false);
    }, 1500);
  };

  const onSubmitOtp = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Verify OTP code:', data);
      setIsLoading(false);
    }, 1500);
  };

  const phoneRegisterProps = otpForm.register('phone');

  const premiumEase = [0.16, 1, 0.3, 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: premiumEase }}
      className="flex flex-col"
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">خوش آمدید</h1>
        <p className="text-sm text-white/50">روش ورود خود را انتخاب کنید</p>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        aria-label="ورود با حساب گوگل"
        className="w-full h-14 mb-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white font-medium transition-all duration-200 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.9 5 12 5z"/>
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
          <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.3-1.4-.3-2.2s.1-1.5.3-2.2L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9c-.3-.9-.5-1.9-.5-3z"/>
          <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.3L1.6 15.9C3.5 19.7 7.4 23 12 23z"/>
        </svg>
        <span>ورود با حساب گوگل (Google)</span>
      </button>

      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-white/10" /></div>
        <span className="relative px-4 bg-transparent backdrop-blur-md text-xs text-white/40">یا با ایمیل و موبایل</span>
      </div>

      <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-2xl mb-6 border border-white/10" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={loginMethod === 'password'}
          onClick={() => setLoginMethod('password')}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20 ${
            loginMethod === 'password' ? 'bg-[rgb(var(--primary))] text-black font-bold shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4" aria-hidden="true" />
          رمز عبور
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={loginMethod === 'otp'}
          onClick={() => setLoginMethod('otp')}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20 ${
            loginMethod === 'otp' ? 'bg-[rgb(var(--primary))] text-black font-bold shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" aria-hidden="true" />
          رمز یکبار مصرف
        </button>
      </div>

      {loginMethod === 'password' ? (
        <form key="form-password" onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="flex flex-col gap-5" noValidate>
          <AuthInput
            key="identifier-input"
            label="ایمیل یا نام کاربری"
            type="text"
            autoComplete="username"
            placeholder="example@domain.com"
            {...passwordForm.register('identifier')}
            error={passwordForm.formState.errors.identifier?.message as string}
            dir="ltr"
          />

          <AuthInput
            key="password-input"
            label="رمز عبور"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...passwordForm.register('password')}
            error={passwordForm.formState.errors.password?.message as string}
            dir="ltr"
          />

          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5 rounded border border-white/20 bg-white/5 group-hover:border-[rgb(var(--primary))] transition-colors">
                <input type="checkbox" {...passwordForm.register('rememberMe')} className="peer sr-only" />
                <div className="absolute inset-0 bg-[rgb(var(--primary))] scale-0 peer-checked:scale-100 transition-transform duration-200 rounded-[3px]" aria-hidden="true" />
              </div>
              <span className="text-sm text-white/60 group-hover:text-white transition-colors select-none">مرا به خاطر بسپار</span>
            </label>

            <Link href="/forgot-password" className="text-sm text-[rgb(var(--primary))] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] rounded px-1">
              بازیابی رمز عبور؟
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="relative overflow-hidden w-full h-14 mt-4 bg-[rgb(var(--primary))] text-black font-bold text-lg rounded-2xl hover:bg-[rgb(var(--primary))]/90 active:scale-98 transition-all duration-300 flex items-center justify-center disabled:opacity-80 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
          >
            {isLoading && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 bg-white/30 z-0"
                aria-hidden="true"
              />
            )}

            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-black" aria-hidden="true" />
                  <span>در حال ورود به حساب...</span>
                </>
              ) : (
                <span>ورود به حساب</span>
              )}
            </span>
          </button>
        </form>
      ) : (
        <form key="form-otp" onSubmit={otpForm.handleSubmit(onSubmitOtp)} className="flex flex-col gap-5" noValidate>
          <AuthInput
            key="phone-input"
            label="شماره تلفن همراه"
            type="tel"
            autoComplete="tel"
            placeholder="09123456789"
            {...phoneRegisterProps}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
              phoneRegisterProps.onChange(e);
            }}
            error={otpForm.formState.errors.phone?.message as string}
            dir="ltr"
            disabled={otpSent}
          />

          {otpSent && (
            <div className="flex flex-col gap-2">
              <label htmlFor="otp-code-input" className="text-sm font-medium text-white/70 ml-1">کد تایید ۴ رقمی</label>
              <input
                id="otp-code-input"
                type="text"
                maxLength={4}
                autoComplete="one-time-code"
                placeholder="• • • •"
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl tracking-widest text-white placeholder:text-white/20 outline-none focus:border-[rgb(var(--primary))] focus:ring-2 focus:ring-[rgb(var(--primary))]/20 transition-all"
                dir="ltr"
                {...otpForm.register('code')}
              />
              
              <div className="flex items-center justify-between text-xs text-white/50 px-1 mt-1">
                <span aria-live="polite">زمان باقی‌مانده: {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? `0${countdown % 60}` : countdown % 60}</span>
                {canResend && (
                  <button type="button" onClick={handleSendOtp} className="text-[rgb(var(--primary))] hover:underline cursor-pointer focus:outline-none focus:ring-1 focus:ring-[rgb(var(--primary))] rounded px-1">
                    ارسال مجدد کد
                  </button>
                )}
              </div>
            </div>
          )}

          {!otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isLoading}
              className="relative overflow-hidden w-full h-14 mt-4 bg-[rgb(var(--primary))] text-black font-bold text-lg rounded-2xl hover:bg-[rgb(var(--primary))]/90 active:scale-98 transition-all duration-300 flex items-center justify-center disabled:opacity-80 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
            >
              {isLoading && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 bg-white/30 z-0"
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-black" aria-hidden="true" />
                    <span>در حال ارسال کد...</span>
                  </>
                ) : (
                  <span>ارسال کد تایید پیامکی</span>
                )}
              </span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="relative overflow-hidden w-full h-14 mt-4 bg-[rgb(var(--primary))] text-black font-bold text-lg rounded-2xl hover:bg-[rgb(var(--primary))]/90 active:scale-98 transition-all duration-300 flex items-center justify-center disabled:opacity-80 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
            >
              {isLoading && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 bg-white/30 z-0"
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-black" aria-hidden="true" />
                    <span>در حال تایید...</span>
                  </>
                ) : (
                  <span>تایید و ورود</span>
                )}
              </span>
            </button>
          )}
        </form>
      )}

      {/* 🌟 بخش تغییر یافته: لینک فوتر با افکت پریمیوم (Animated Underline) */}
      <div className="mt-8 flex items-center justify-center gap-1.5 text-sm text-white/50">
        <span>حساب کاربری ندارید؟</span>
        <Link 
          href="/register" 
          className="group relative text-white font-bold transition-colors hover:text-[rgb(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 rounded px-1.5 py-0.5"
        >
          ثبت‌نام کنید
          <span 
            className="absolute inset-x-1 -bottom-0.5 h-[2px] bg-[rgb(var(--primary))] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right rounded-full" 
            aria-hidden="true" 
          />
        </Link>
      </div>

    </motion.div>
  );
}