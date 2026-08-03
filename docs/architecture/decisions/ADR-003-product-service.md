# ADR 003: Product Data Service Architecture

**Status:** Accepted
**Date:** [Current Date]
**Sprint:** 3

## Context
پروژه در حال حاضر به دیتابیس واقعی متصل نیست، اما معماری باید به گونه‌ای باشد که در زمان اتصال به Backend (اسپرینت‌های نهایی)، نیازی به تغییر لاجیک‌های UI نباشد.

## Decision
یک لایه سرویس شبیه‌سازی شده (`src/services/productService.ts`) ایجاد شد:
- داده‌ها با ساختار Promise و شبیه‌سازی تاخیر شبکه (Network Latency) بازگردانده می‌شوند.
- تایپ‌های TypeScript به صورت سخت‌گیرانه (Strict) برای مدلهای محصول (Product, Variants) تعریف شدند.
- فیلترینگ و مرتب‌سازی در داخل همین سرویس هندل می‌شود تا رفتار سرور واقعی را تقلید کند.

## Consequences
**Positive:**
- کامپوننت‌های UI کاملاً از منبع داده (Data Source) مستقل (Decoupled) شدند.
- سوئیچ کردن به API واقعی (مثل REST یا GraphQL) در آینده تنها با تغییر کدهای داخل `productService.ts` انجام می‌شود.