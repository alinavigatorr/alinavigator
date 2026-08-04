'use client';

import { motion } from 'framer-motion';

interface PasswordMeterProps {
  password?: string;
}

export function PasswordMeter({ password = '' }: PasswordMeterProps) {
  const rules = [
    { label: 'حداقل ۸ کاراکتر', met: password.length >= 8 },
    { label: 'حرف بزرگ', met: /[A-Z]/.test(password) },
    { label: 'حرف کوچک', met: /[a-z]/.test(password) },
    { label: 'عدد', met: /[0-9]/.test(password) },
    { label: 'کاراکتر خاص', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = rules.filter(r => r.met).length;
  
  let barColor = 'bg-[rgb(var(--error))]';
  
  if (score >= 3 && score < 5) {
    barColor = 'bg-amber-400';
  } else if (score === 5) {
    barColor = 'bg-[rgb(var(--success))]';
  }

  return (
    // متن بالا حذف شد، فاصله تنظیم شد
    <div className="flex gap-1 h-1 w-full rounded-full overflow-hidden bg-white/5 mt-1 px-1" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((level) => (
        <motion.div
          key={level}
          className={`h-full flex-1 transition-colors duration-300 ${score >= level ? barColor : 'bg-transparent'}`}
        />
      ))}
    </div>
  );
}