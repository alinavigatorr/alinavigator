'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  textarea?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, FormInputProps>(
  ({ label, error, textarea, id, required, ...props }, ref) => {
    const inputId = id || label;
    const baseClasses = `w-full bg-white/5 border transition-all duration-300 rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-white/20 focus:bg-white/10 ${
      error 
        ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/50' 
        : 'border-white/10 hover:border-white/20 focus:border-[rgb(var(--primary))] focus:ring-2 focus:ring-[rgb(var(--primary))]/20'
    }`;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={inputId} className="text-xs font-medium text-white/70 tracking-wide flex items-center gap-1">
          {label} {required && <span className="text-[rgb(var(--primary))]" aria-hidden="true">*</span>}
        </label>
        <div className="relative">
          {textarea ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              id={inputId}
              aria-invalid={!!error}
              aria-describedby={error ? `${inputId}-error` : undefined}
              className={`${baseClasses} min-h-[100px] resize-y`}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              id={inputId}
              aria-invalid={!!error}
              aria-describedby={error ? `${inputId}-error` : undefined}
              className={baseClasses}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.span
              id={`${inputId}-error`}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-[11px] font-bold text-red-400 mt-0.5"
              role="alert"
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';