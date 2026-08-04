export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05, // تاخیر بسیار کوتاه ۵۰ میلی‌ثانیه‌ای
      delayChildren: 0.05,
    }
  }
};

// برای استفاده روی فرزندانِ داخلِ کانتینر
export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};