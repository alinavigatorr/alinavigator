'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AuthInput } from '../../../components/auth/auth-input';
import { PasswordMeter } from '../../../components/auth/password-meter'; 
import { UsernameInput } from '../../../components/auth/username-input'; 
import { Loader2, AlertCircle } from 'lucide-react';

// 🌟 اسکیما آپدیت شد: فیلد تکرار رمز عبور به طور کامل حذف شد
const registerSchema = z.object({
  firstName: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  lastName: z.string().min(2, 'نام خانوادگی باید حداقل ۲ کاراکتر باشد'),
  username: z.string()
    .min(3, 'نام کاربری باید حداقل ۳ کاراکتر باشد')
    .regex(/^[a-zA-Z0-9_]+$/, 'نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و زیرخط (_) باشد'),
  email: z.string().min(1, 'ایمیل الزامی است').email('فرمت ایمیل نامعتبر است'),
  phone: z.string().regex(/^09[0-9]{9}$/, 'فرمت شماره موبایل نامعتبر است (مثال: 09123456789)'),
  password: z.string()
    .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
    .regex(/[A-Z]/, 'باید شامل حداقل یک حرف بزرگ انگلیسی باشد')
    .regex(/[a-z]/, 'باید شامل حداقل یک حرف کوچک انگلیسی باشد')
    .regex(/[0-9]/, 'باید شامل حداقل یک عدد باشد'),
  terms: z.boolean().refine(val => val === true, "پذیرش قوانین الزامی است")
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch('password', '');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    // TODO: اتصال به API ثبت‌نام و بررسی یکتا بودن نام کاربری
    setTimeout(() => {
      console.log('Production Register Data:', data);
      setIsLoading(false);
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">ایجاد حساب کاربری</h1>
        <p className="text-sm text-white/50">به خانواده علی‌ناویتور بپیوندید</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <AuthInput
            label="نام"
            type="text"
            placeholder="مثال: علی"
            {...register('firstName')}
            error={errors.firstName?.message}
          />
          <AuthInput
            label="نام خانوادگی"
            type="text"
            placeholder="مثال: شمس"
            {...register('lastName')}
            error={errors.lastName?.message}
          />
        </div>

        <UsernameInput 
          register={register} 
          error={errors.username?.message} 
          setValue={setValue} 
        />

        <AuthInput
          label="ایمیل"
          type="email"
          placeholder="name@example.com"
          {...register('email')}
          error={errors.email?.message}
          dir="ltr"
        />

        <AuthInput
          label="تلفن همراه"
          type="tel"
          placeholder="09123456789"
          {...register('phone')}
          error={errors.phone?.message}
          dir="ltr"
        />

        {/* 🌟 فیلد رمز عبور همراه با HelperText و PasswordMeter در زیر آن */}
        <div className="flex flex-col gap-1">
          <AuthInput
            label="رمز عبور"
            type="password"
            placeholder="••••••••"
            helperText="حداقل ۸ کاراکتر شامل حروف بزرگ، کوچک و عدد"
            {...register('password')}
            error={errors.password?.message}
            dir="ltr"
          />
          <PasswordMeter password={passwordValue} />
        </div>

        {/* 🌟 باکس تکرار رمز عبور کاملا حذف شد و قوانین به بالا منتقل شد */}
        
        <div className="mt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 rounded border border-white/20 bg-white/5 group-hover:border-[rgb(var(--primary))] transition-colors shrink-0">
              <input type="checkbox" {...register('terms')} className="peer sr-only" aria-describedby={errors.terms ? "terms-error" : undefined} />
              <div className="absolute inset-0 bg-[rgb(var(--primary))] scale-0 peer-checked:scale-100 transition-transform duration-200 rounded-[3px]" aria-hidden="true" />
            </div>
            <span className="text-sm text-white/60 group-hover:text-white transition-colors select-none">
              با مطالعه و پذیرش <Link href="/terms" className="text-[rgb(var(--primary))] hover:underline focus:outline-none focus:ring-1 focus:ring-[rgb(var(--primary))] rounded px-1">قوانین و مقررات</Link> سایت موافقم.
            </span>
          </label>
          <AnimatePresence>
            {errors.terms?.message && (
              <motion.div id="terms-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-1.5 text-[rgb(var(--error))] text-[11px] font-medium ml-8 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.terms.message as string}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="relative overflow-hidden w-full h-14 mt-4 bg-[rgb(var(--primary))] text-black font-bold text-lg rounded-2xl hover:bg-[rgb(var(--primary))]/90 hover:scale-[0.98] active:scale-95 transition-all duration-200 flex items-center justify-center disabled:opacity-80 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-white"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-black" aria-hidden="true" />
              <span>در حال ساخت حساب...</span>
            </div>
          ) : (
            <span>ثبت‌نام و ورود</span>
          )}
        </button>
      </form>

      {/* 🌟 لینک فوتر پریمیوم */}
      <div className="mt-8 flex items-center justify-center gap-1.5 text-sm text-white/50">
        <span>حساب کاربری دارید؟</span>
        <Link 
          href="/login" 
          className="group relative text-white font-bold transition-colors hover:text-[rgb(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 rounded px-1.5 py-0.5"
        >
          وارد شوید
          <span 
            className="absolute inset-x-1 -bottom-0.5 h-[2px] bg-[rgb(var(--primary))] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right rounded-full" 
            aria-hidden="true" 
          />
        </Link>
      </div>
      
    </motion.div>
  );
}