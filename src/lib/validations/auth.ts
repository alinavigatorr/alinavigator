import * as z from 'zod';

export const usernameSchema = z.string()
  .min(3, 'نام کاربری باید حداقل ۳ کاراکتر باشد')
  .max(20, 'نام کاربری حداکثر می‌تواند ۲۰ کاراکتر باشد')
  .regex(/^[a-z0-9_]+$/, 'فقط حروف کوچک انگلیسی، اعداد و زیرخط (_) مجاز است')
  .transform((val) => val.toLowerCase());

export const passwordSchema = z.string()
  .min(8, 'حداقل ۸ کاراکتر')
  .regex(/[A-Z]/, 'یک حرف بزرگ')
  .regex(/[a-z]/, 'یک حرف کوچک')
  .regex(/[0-9]/, 'یک عدد')
  .regex(/[^A-Za-z0-9]/, 'یک کاراکتر خاص');

export const registerSchema = z.object({
  firstName: z.string().min(2, 'نام الزامی است'),
  lastName: z.string().min(2, 'نام خانوادگی الزامی است'),
  username: usernameSchema,
  email: z.string().email('ایمیل نامعتبر است'),
  phone: z.string().regex(/^09[0-9]{9}$/, 'فرمت شماره موبایل نامعتبر است').optional(),
  password: passwordSchema,
});