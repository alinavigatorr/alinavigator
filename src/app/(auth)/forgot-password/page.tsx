'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AuthInput } from '../../../components/auth/auth-input';
import { Loader2, ArrowRight } from 'lucide-react';

const forgotSchema = z.object({
  email: z.string().min(1, 'ایمیل الزامی است').email('فرمت ایمیل نامعتبر است'),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Forgot Password Email:', data.email);
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const premiumEase = [0.16, 1, 0.3, 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: premiumEase }}
      className="flex flex-col"
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">بازیابی رمز عبور</h1>
        <p className="text-sm text-white/50">ایمیل خود را وارد کنید تا لینک بازیابی را برایتان ارسال کنیم</p>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <AuthInput
            label="ایمیل"
            type="email"
            placeholder="name@example.com"
            {...register('email')}
            error={errors.email?.message}
            dir="ltr"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 mt-4 bg-[rgb(var(--primary))] text-black font-bold text-lg rounded-2xl hover:bg-[rgb(var(--primary))]/90 hover:scale-[0.98] active:scale-95 transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:pointer-events-none"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'ارسال لینک بازیابی'}
          </button>
        </form>
      ) : (
        <div className="text-center py-4">
          <div className="p-4 rounded-2xl bg-[rgb(var(--success))]/10 border border-[rgb(var(--success))]/20 text-[rgb(var(--success))] text-sm font-medium mb-6">
            لینک بازیابی رمز عبور با موفقیت به ایمیل شما ارسال شد. لطفا صندوق ورودی خود را بررسی کنید.
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
          <ArrowRight className="w-4 h-4" />
          بازگشت به صفحه ورود
        </Link>
      </div>
    </motion.div>
  );
}