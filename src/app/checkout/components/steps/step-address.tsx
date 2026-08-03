'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import type { CheckoutAddress } from '../../use-checkout-session';

interface StepAddressProps {
  data: CheckoutAddress;
  onUpdate: (addr: CheckoutAddress) => void;
  onNext: () => void;
}

const provinces = ['تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی', 'گیلان', 'مازندران', 'البرز'];

export function StepAddress({ data, onUpdate, onNext }: StepAddressProps) {
  const isComplete =
    data.fullName.trim() &&
    data.phone.trim().length >= 10 &&
    data.province &&
    data.city.trim() &&
    data.address.trim() &&
    data.postalCode.trim().length >= 10;

  const handleChange = (field: keyof CheckoutAddress, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  const inputClass =
    'w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[rgb(var(--primary))] focus:ring-1 focus:ring-[rgb(var(--primary))] outline-none transition-colors';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20">
          <MapPin className="w-5 h-5 text-[rgb(var(--primary))]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">آدرس تحویل</h2>
          <p className="text-xs text-white/40">اطعامات گیرنده و آدرس را وارد کنید</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs text-white/50 mb-2">نام و نام خانوادگی</label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="مثلاً علی رضایی"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-2">شماره موبایل</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="09123456789"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-2">کد پستی</label>
          <input
            type="text"
            value={data.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            placeholder="1234567890"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-2">استان</label>
          <select
            value={data.province}
            onChange={(e) => handleChange('province', e.target.value)}
            className={inputClass}
          >
            <option value="" className="bg-[rgb(var(--background))]">انتخاب استان</option>
            {provinces.map((p) => (
              <option key={p} value={p} className="bg-[rgb(var(--background))]">
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-2">شهر</label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="نام شهر"
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs text-white/50 mb-2">آدرس کامل</label>
          <textarea
            value={data.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="خیابان، کوچه، پلاک، واحد"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      <div className="flex justify-start mt-8">
        <button
          onClick={onNext}
          disabled={!isComplete}
          className="flex items-center gap-2 bg-[rgb(var(--primary))] text-black px-6 py-3 rounded-xl font-bold text-sm transition-all hover:bg-[rgb(var(--primary))]/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          مرحله بعد
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
