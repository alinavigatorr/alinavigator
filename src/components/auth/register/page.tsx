'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AuthInput } from '../../../components/auth/auth-input';
import { Loader2 } from 'lucide-react';

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
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    // TODO: اتصال به API ثبت‌نام و بررسی یکتا بودن نام کاربری
    setTimeout(() => {
      console.log('Register Data:', data);
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

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

        <AuthInput
          label="نام کاربری (انگلیسی)"
          type="text"
          placeholder="مثال: alinavigator"
          {...register('username')}
          error={errors.username?.message}
          dir="ltr"
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

        <AuthInput
          label="رمز عبور"
          type="password"
          placeholder="••••••••"
          helperText="حداقل ۸ کاراکتر شامل حروف بزرگ، کوچک و عدد"
          {...register('password')}
          error={errors.password?.message}
          dir="ltr"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="relative overflow-hidden w-full h-14 mt-4 bg-[rgb(var(--primary))] text-black font-bold text-lg rounded-2xl hover:bg-[rgb(var(--primary))]/90 hover:scale-[0.98] active:scale-95 transition-all duration-200 flex items-center justify-center disabled:opacity-80 disabled:pointer-events-none"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-black" />
              <span>در حال ساخت حساب...</span>
            </div>
          ) : (
            <span>ثبت‌نام و ورود</span>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-white/50">
        حساب کاربری دارید؟{' '}
        <Link href="/login" className="text-white hover:text-[rgb(var(--primary))] font-medium transition-colors">
          وارد شوید
        </Link>
      </p>
    </motion.div>
  );
}