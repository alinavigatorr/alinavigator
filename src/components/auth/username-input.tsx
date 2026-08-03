'use client';

import { useState, useEffect } from 'react';
import { AuthInput } from './auth-input';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function UsernameInput({ register, error, setValue }: any) {
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (username.length < 3) {
      setIsAvailable(null);
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsChecking(true);
      // TODO: Call API /api/auth/check-username
      const taken = username === 'alinavigator'; // Mock: فرض می‌کنیم این نام گرفته شده
      setIsAvailable(!taken);
      
      if (taken) {
        setSuggestions([`${username}_official`, `${username}92`, `${username}_vip`]);
      } else {
        setSuggestions([]);
      }
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSuggestionClick = (suggestion: string) => {
    setUsername(suggestion);
    setValue('username', suggestion, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <AuthInput
          label="نام کاربری"
          type="text"
          placeholder="username_123"
          {...register('username')}
          onChange={(e) => {
            const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
            setUsername(val);
            e.target.value = val;
            register('username').onChange(e);
          }}
          error={error}
          dir="ltr"
        />
        <div className="absolute left-4 top-[42px] -translate-y-1/2">
          {isChecking && <Loader2 className="w-4 h-4 text-white/50 animate-spin" />}
          {!isChecking && isAvailable === true && <CheckCircle2 className="w-4 h-4 text-[rgb(var(--success))]" />}
          {!isChecking && isAvailable === false && <XCircle className="w-4 h-4 text-[rgb(var(--error))]" />}
        </div>
      </div>

      {/* پیشنهادات نام کاربری */}
      {suggestions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mt-1">
          <span className="text-xs text-white/50 w-full">پیشنهادات:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSuggestionClick(s)}
              className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70"
            >
              {s}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}