'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useRouter } from 'next/navigation';
import { FormInput } from '../../components/checkout/form-input';
import { DeliveryMethods, DeliveryMethod } from '../../components/checkout/delivery-methods';
import { OrderSummary } from '../../components/checkout/order-summary';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function CheckoutClient() {
  const { items, isMounted } = useCart();
  const router = useRouter();
  
  // State
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard');
  const [useSameBilling, setUseSameBilling] = useState(true);
  
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    province: '', city: '', postalCode: '', address: '',
    // Billing specific
    b_firstName: '', b_lastName: '', b_province: '', b_city: '', b_postalCode: '', b_address: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingCosts = { standard: 0, express: 95000, pickup: 0 };

  // Checkout Protection
  useEffect(() => {
    if (isMounted && items.length === 0) {
      // Small delay to allow animation before potential redirect
    }
  }, [items, isMounted, router]);

  // Client-side Validation logic
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'نام الزامی است';
    if (!form.lastName.trim()) newErrors.lastName = 'نام خانوادگی الزامی است';
    if (!/^\d{10,11}$/.test(form.phone)) newErrors.phone = 'شماره تماس معتبر نیست (۱۰ یا ۱۱ رقم)';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'ایمیل معتبر نیست';
    if (!form.province.trim()) newErrors.province = 'استان الزامی است';
    if (!form.city.trim()) newErrors.city = 'شهر الزامی است';
    if (!/^\d{10}$/.test(form.postalCode)) newErrors.postalCode = 'کد پستی باید دقیقاً ۱۰ رقم باشد';
    if (form.address.length < 10) newErrors.address = 'آدرس باید حداقل ۱۰ کاراکتر باشد';

    if (!useSameBilling) {
      if (!form.b_firstName.trim()) newErrors.b_firstName = 'نام الزامی است';
      if (!form.b_postalCode.trim()) newErrors.b_postalCode = 'کد پستی الزامی است';
      // Add more specific billing validation as needed
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  // For real implementation, validation runs on submit. But we disable button if untouched required fields are empty
  const isFormFilled = form.firstName && form.lastName && form.phone && form.email && form.province && form.city && form.postalCode && form.address;

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-white/20" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">سبد خرید شما خالی است</h1>
          <p className="text-white/50 mb-8 max-w-md mx-auto">برای ثبت سفارش ابتدا محصولاتی را به سبد خرید خود اضافه کنید.</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-[rgb(var(--primary))] text-black px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
            بازگشت به فروشگاه <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32 md:pb-12">
      <h1 className="text-3xl font-black text-white mb-10">تکمیل سفارش</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Forms Section */}
        <div className="flex-1 space-y-12">
          
          {/* Shipping Form */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">اطلاعات ارسال</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormInput label="نام" required value={form.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} error={errors.firstName} />
              <FormInput label="نام خانوادگی" required value={form.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} error={errors.lastName} />
              <FormInput label="شماره موبایل" type="tel" dir="ltr" required value={form.phone} onChange={(e) => handleInputChange('phone', e.target.value)} error={errors.phone} />
              <FormInput label="ایمیل" type="email" dir="ltr" required value={form.email} onChange={(e) => handleInputChange('email', e.target.value)} error={errors.email} />
              <FormInput label="استان" required value={form.province} onChange={(e) => handleInputChange('province', e.target.value)} error={errors.province} />
              <FormInput label="شهر" required value={form.city} onChange={(e) => handleInputChange('city', e.target.value)} error={errors.city} />
              <FormInput label="کد پستی" type="text" dir="ltr" required value={form.postalCode} onChange={(e) => handleInputChange('postalCode', e.target.value)} error={errors.postalCode} className="sm:col-span-2" />
              <FormInput label="آدرس دقیق پستی" textarea required value={form.address} onChange={(e) => handleInputChange('address', e.target.value)} error={errors.address} />
            </div>
          </section>

          {/* Billing Toggle */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">اطلاعات صورتحساب</h2>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${useSameBilling ? 'bg-[rgb(var(--primary))] border-[rgb(var(--primary))]' : 'bg-transparent border-white/20 group-hover:border-white/40'}`}>
                {useSameBilling && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
              </div>
              <span className="text-sm text-white/80 select-none">همان آدرس ارسال استفاده شود</span>
              <input type="checkbox" className="sr-only" checked={useSameBilling} onChange={(e) => setUseSameBilling(e.target.checked)} aria-label="استفاده از آدرس ارسال برای صورتحساب" />
            </label>

            {/* Fake alternative billing form for UX demo */}
            {!useSameBilling && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 opacity-50 pointer-events-none">
                <FormInput label="نام (صورتحساب)" value="" onChange={()=>{}} />
                <FormInput label="آدرس (صورتحساب)" textarea value="" onChange={()=>{}} />
                <p className="text-xs text-white/40 sm:col-span-2">این بخش فقط جهت نمایش رابط کاربری است و غیرفعال می‌باشد.</p>
              </motion.div>
            )}
          </section>

          <DeliveryMethods selected={deliveryMethod} onChange={setDeliveryMethod} />

        </div>

        {/* Sidebar Summary */}
        <div className="w-full lg:w-[400px] shrink-0">
          <OrderSummary 
            shippingCost={shippingCosts[deliveryMethod]} 
            isValid={!!isFormFilled} 
            onSubmit={() => {
              if (validateForm()) alert('اتصال به درگاه در اسپرینت‌های آینده پیاده‌سازی خواهد شد.');
            }} 
          />
        </div>
      </div>

      {/* Sticky Mobile Submit Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 z-50">
        <button
          onClick={() => {
            if (validateForm()) alert('تایید فرم و ارسال به مرحله بعد');
          }}
          disabled={!isFormFilled}
          className="w-full py-3.5 rounded-xl bg-[rgb(var(--primary))] text-black font-black text-base hover:opacity-90 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(var(--primary),0.2)] outline-none focus:ring-2 focus:ring-white"
        >
          تایید و پرداخت
        </button>
      </div>
    </div>
  );
}