# ADR 001: Premium Design System & Token Architecture

**Status:** Accepted
**Date:** [Current Date]
**Sprint:** 4.5

## Context
پلتفرم AliNavigator نیازمند یک زبان بصری منسجم، لوکس و پرچمدار (مشابه Apple و Linear) بود. استفاده از مقادیر هاردکد شده (Hardcoded) برای رنگ‌ها و فواصل باعث ایجاد بدهی فنی (Technical Debt) و ناهماهنگی در رابط کاربری می‌شد.

## Decision
تصمیم گرفتیم یک Design System مبتنی بر متغیرهای CSS (Design Tokens) پیاده‌سازی کنیم:
- **رنگ‌بندی:** حذف مشکی مطلق (`#000000`) و جایگزینی آن با سطوح عمیق (Deep Surfaces) مثل `#08080A`.
- **تایپوگرافی:** استفاده از جفت فونت Vazirmatn (فارسی) و Geist/Inter (لاتین).
- **المان‌ها:** استانداردسازی Glassmorphism (`backdrop-blur`) و Border Radius ها در ۴ سطح (sm, md, lg, xl).

## Consequences
**Positive:**
- یکپارچگی ۱۰۰ درصدی در تمام صفحات آینده.
- تغییر تم (Theme) در آینده تنها با تغییر چند متغیر CSS امکان‌پذیر است.
- کاهش حجم کدهای Tailwind در فایل‌های کامپوننت.

**Negative:**
- توسعه‌دهندگان جدید باید ابتدا با متغیرهای فایل `globals.css` آشنا شوند.