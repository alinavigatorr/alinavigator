import { defaultConfig, ApiConfig } from './api-config';
import { ExtendedRequestOptions } from './request-options';
import { BaseNetworkError, UnauthorizedError } from './network-errors';

// --- NEW IMPORTS (اضافه شده) ---
import { RequestBuilder } from './network/request-builder';
import { ResponseParser } from './network/response-parser';
import { ErrorMapper } from './network/error-mapper';
import { networkLogger } from './network/network-logger';
import { tokenManager } from '../auth/token-manager';

export class HttpClient {
  private config: ApiConfig;

  constructor(config: ApiConfig = defaultConfig) {
    this.config = config;
  }

  // ==========================================
  // EXTENSION POINTS
  // ==========================================

  private getAuthToken(): string | null {
    // اتصال به سیستم مدیریت توکن که در فاز ۳ ساخته شد
    return tokenManager.getAccessToken(); 
  }

  private async handleRefreshToken(): Promise<boolean> {
    // Placeholder: Refresh Token Flow
    return false;
  }

  private getLocalizationHeaders(): Record<string, string> {
    return {};
  }

  private getCurrencyHeaders(): Record<string, string> {
    return {};
  }

  // ==========================================
  // CORE REQUEST MECHANISM
  // ==========================================

  async request<T>(endpoint: string, options: ExtendedRequestOptions = {}): Promise<T> {
    const { 
      requireAuth = true, 
      timeout = this.config.timeout,
      retries = this.config.retries,
      ...fetchOptions 
    } = options;

    // 1. استفاده از RequestBuilder برای ساخت یکپارچه آدرس و هدرها
    const url = RequestBuilder.buildUrl(endpoint, this.config);
    const headers = RequestBuilder.buildHeaders(options, {
      getToken: () => this.getAuthToken(),
      getLocalization: () => this.getLocalizationHeaders(),
      getCurrency: () => this.getCurrencyHeaders(),
    });

    // 2. مدیریت تایم‌اوت
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const signal = options.signal || controller.signal;

    const finalOptions = RequestBuilder.buildFetchOptions(options, headers, signal);
    
    networkLogger.logRequest(finalOptions.method || 'GET', url, headers, finalOptions.body);
    const startTime = Date.now();

    try {
      // 3. ارسال درخواست (تنها نقطه استفاده از fetch خام در کل پروژه)
      const response = await fetch(url, finalOptions);
      clearTimeout(id);

      networkLogger.logResponse(response.status, url, Date.now() - startTime);

      // 4. مدیریت خطاهای HTTP با استفاده از ErrorMapper
      if (!response.ok) {
        if (response.status === 401) {
           // در آینده: اینجا متد handleRefreshToken فراخوانی می‌شود
        }
        throw await ErrorMapper.mapResponseError(response);
      }

      // 5. پارس کردن هوشمند پاسخ با استفاده از ResponseParser
      return await ResponseParser.parse<T>(response);

    } catch (error: any) {
      clearTimeout(id);
      
      // ترجمه خطای سیستمی (مثل قطعی اینترنت یا تایم‌اوت)
      const mappedError = ErrorMapper.mapNetworkException(error, timeout);
      networkLogger.logError(url, mappedError);

      // 6. منطق تلاش مجدد (Retry) در صورت شکست (به جز خطاهای امنیتی)
      if (retries > 0 && !(mappedError instanceof UnauthorizedError)) {
        networkLogger.logError(url, `Retrying... (${retries} left)`);
        return this.request<T>(endpoint, { ...options, retries: retries - 1 });
      }

      throw mappedError;
    }
  }

  // ==========================================
  // CONVENIENCE VERBS (بدون تغییر می‌مانند)
  // ==========================================
  
  // async get<T>...
  // async post<T>...
  // ...
} // <-- این آکولاد جا افتاده بود که اضافه شد