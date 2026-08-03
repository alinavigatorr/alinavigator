'use client';

import React, { useState, forwardRef, useId } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, type, error, helperText, className = '', dir, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const uniqueId = useId();
    const inputId = id || uniqueId;
    
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={inputId} className="text-sm font-medium text-white/70 ml-1">
          {label}
        </label>
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            dir={dir}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={`w-full h-14 bg-white/5 border rounded-2xl px-5 text-white placeholder:text-white/30 outline-none transition-all duration-300
              ${isPassword ? 'pr-12 pl-4' : ''}
              ${error 
                ? 'border-[rgb(var(--error))]/50 focus:border-[rgb(var(--error))] focus:bg-[rgb(var(--error))]/5 focus:ring-2 focus:ring-[rgb(var(--error))]/20' 
                : 'border-white/10 focus:border-[rgb(var(--primary))] focus:bg-white/10 focus:ring-2 focus:ring-[rgb(var(--primary))]/20'
              } ${className}`}
            {...props}
          />
          {/* آیکون چشم ثابت در سمت راست برای فیلدهای رمز عبور */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-md"
              aria-label={showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
            </button>
          )}
        </div>

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-[11px] text-white/40 ml-1 leading-relaxed">
            {helperText}
          </p>
        )}
        
        <AnimatePresence>
          {error && (
            <motion.div
              id={`${inputId}-error`}
              role="alert"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="flex items-center gap-1.5 text-[rgb(var(--error))] text-xs font-medium ml-1"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';