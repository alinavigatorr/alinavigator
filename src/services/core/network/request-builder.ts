// src/services/core/network/request-builder.ts

import { ApiConfig } from '../api-config';
import { ExtendedRequestOptions } from '../request-options';

export class RequestBuilder {
  /**
   * ساخت URL نهایی بر اساس تنظیمات محیطی، نسخه API و اندپوینت
   */
  static buildUrl(endpoint: string, config: ApiConfig): string {
    // حذف اسلش‌های اضافی برای جلوگیری از خطای // در URL
    const baseUrl = config.baseUrl.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    
    // الگوی استاندارد: https://api.domain.com/api/v1/endpoint
    // اگر بیس‌یوآرال خالی باشد (مثل مسیرهای نسبی در Next.js)، فقط اندپوینت ساخته می‌شود
    if (!baseUrl) {
      return `/api/${config.version}/${cleanEndpoint}`;
    }
    
    return `${baseUrl}/api/${config.version}/${cleanEndpoint}`;
  }

  /**
   * تزریق هوشمندانه هدرها (شامل توکن، زبان، ارز و فرمت داده)
   */
  static buildHeaders(
    options: ExtendedRequestOptions,
    injectors?: {
      getToken?: () => string | null;
      getLocalization?: () => Record<string, string>;
      getCurrency?: () => Record<string, string>;
    }
  ): Headers {
    const headers = new Headers(options.headers || {});

    // تنظیم پیش‌فرض Content-Type برای ارسال داده‌های JSON (به جز FormData برای آپلود فایل)
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    // تزریق توکن احراز هویت (در صورت نیاز و وجود تابع تزریق‌کننده)
    if (options.requireAuth !== false && injectors?.getToken) {
      const token = injectors.getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    // تزریق هدرهای زبان (Localization)
    if (injectors?.getLocalization) {
      Object.entries(injectors.getLocalization()).forEach(([key, value]) => headers.set(key, value));
    }

    // تزریق هدرهای مالی و ارزی (Currency)
    if (injectors?.getCurrency) {
      Object.entries(injectors.getCurrency()).forEach(([key, value]) => headers.set(key, value));
    }

    return headers;
  }

  /**
   * ساخت آپشن‌های نهایی Fetch (جداسازی فیلدهای کاستوم از فیلدهای استاندارد)
   */
  static buildFetchOptions(
    options: ExtendedRequestOptions,
    headers: Headers,
    signal: AbortSignal
  ): RequestInit {
    // جداسازی پراپرتی‌های اختصاصی سیستم خودمان تا به fetch خام ارسال نشوند
    const { 
      requireAuth, 
      timeout, 
      retries, 
      skipErrorHandling, 
      ...nativeFetchOptions 
    } = options;
    
    return {
      ...nativeFetchOptions,
      headers,
      signal,
    };
  }
}