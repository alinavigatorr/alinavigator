# AliNavigator Premium Design Guidelines

این سند زبان بصری، قوانین تایپوگرافی، رنگ و تعاملات سایت AliNavigator را تعیین می‌کند. هدف ما خلق تجربه‌ای لوکس، آرام و مینیمال با الهام از استانداردهای Apple، Vercel و Linear است.

## 1. Typography (تایپوگرافی)
- **فونت لاتین:** Geist (یا Inter به عنوان جایگزین)
- **فونت فارسی:** Vazirmatn (وزن‌های 400, 500, 700, 800)
- **Scale:**
  - H1 (Hero): `text-5xl` تا `text-7xl` (با `tracking-tight` و `leading-tight`)
  - H2 (Section): `text-3xl`
  - Body: `text-base` (با `leading-relaxed` برای خوانایی بالا)
  - Muted/Subtle: `text-sm` یا `text-xs` (رنگ `text-white/60`)

## 2. Color System (سیستم رنگی)
ما از مشکی مطلق (`#000000`) استفاده نمی‌کنیم. 
- **Background:** `#08080A` (سطح عمیق پرچمدار)
- **Surface:** `#121215` (کارت‌ها و مدال‌ها)
- **Primary:** `#14b8a6` (Teal - رنگ سازمانی)
- **Text:** `#FAFAFA` (سفید نرم برای جلوگیری از خستگی چشم)
- **Borders:** `rgba(255, 255, 255, 0.10)` (یا `white/10` در Tailwind)

## 3. Elevation & Glassmorphism (عمق و شیشه)
- **Navbars/Sticky Elements:** استفاده از افکت `backdrop-blur-xl` ترکیب شده با `bg-[rgb(var(--surface-glass))]/60`.
- **Shadows:** سایه‌های نرم و پراکنده (Glow) با ته‌رنگ Primary برای دکمه‌های اصلی (`0 0 15px rgba(20,184,166,0.15)`).

## 4. Border Radius (شعاع حاشیه‌ها)
- `radius-sm` (6px): بج‌ها، تگ‌ها، چک‌باکس‌ها
- `radius-md` (8px): دکمه‌ها (Buttons)، فیلدهای متنی (Inputs)
- `radius-lg` (16px): کارت‌های محصول (Product Cards)
- `radius-xl` (24px): کشوها (Drawers)، مُدال‌ها، بنرهای بزرگ (Hero/Banner)

## 5. Spacing (فاصله‌گذاری)
سیستم فاصله‌گذاری بر اساس ضریب 4px است (استاندارد Tailwind).
- فاصله بین سکشن‌ها (Sections): `py-24` یا `py-32`
- فاصله بین آیتم‌های داخلی گرید: `gap-6` یا `gap-8`

## 6. Motion Rules (قوانین انیمیشن)
انیمیشن‌ها نباید باعث حواس‌پرتی شوند.
- **Easing:** `cubic-bezier(0.32, 0.72, 0, 1)` (مشابه اپل، شروع سریع و توقف نرم).
- **Hover:** تغییرات Scale حداکثر بین `1.01` تا `1.02`.
- **Tap/Click:** افت مقیاس به `0.98`.
- **Accessibility:** احترام به تنظیمات سیستمی کاربر با استفاده از هوک `useReducedMotion`.

## 7. Inputs & Forms
فیلدها باید دارای پس‌زمینه `bg-white/5`، حاشیه `border-white/10` و بهنگام فوکوس دارای `ring-2` با رنگ Primary باشند.

---
*قانون طلایی:* سادگی نهایت پیچیدگی است. از اضافه کردن رنگ‌ها یا سایه‌های بی‌دلیل خودداری کنید.