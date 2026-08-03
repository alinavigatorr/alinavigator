# ADR 004: Product Detail Page (PDP) Architecture

**Status:** Accepted
**Date:** [Current Date]
**Sprint:** 5 (Phase 0)

## Context
صفحه جزئیات محصول حیاتی‌ترین صفحه برای SEO و Conversion Rate است و نیازمند تعادل بین پرفورمنس استاتیک و تعاملات داینامیک است.

## Decision
معماری هیبریدی (Server/Client) برای این صفحه اتخاذ شد:
- **Server Components:** برای دریافت داده‌ها، متادیتا (SEO) و رندر اطلاعات استاتیک (ProductInfo).
- **Client Components:** فقط برای بخش‌های تعاملی (Gallery، VariantSelector، AddToCartButton).
- **Data Fetching:** استفاده از Parallel Fetching و استراتژی Streaming با Suspense Boundaries.
- **Error/Loading:** پیاده‌سازی `loading.tsx` با اسکلت‌های دقیق و `error.tsx` به صورت Localized.

## Consequences
**Positive:**
- شاخص LCP (پرفورمنس) و SEO به حداکثر می‌رسد.
- تعامل کاربر با گالری عکس‌ها و دکمه خرید سریع و بدون تاخیر است.
- ایزوله شدن خطاها (کرش کردن گالری باعث از کار افتادن کل صفحه نمی‌شود).