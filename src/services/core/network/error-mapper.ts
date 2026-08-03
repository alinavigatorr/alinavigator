// src/services/core/network/error-mapper.ts

import { 
  HttpError, 
  TimeoutError, 
  UnauthorizedError, 
  BaseNetworkError 
} from '../network-errors';

export class ErrorMapper {
  /**
   * ترجمه خطاهای HTTP (پاسخ‌های دارای Status Code ناموفق) به خطاهای سیستمی
   */
  static async mapResponseError(response: Response): Promise<BaseNetworkError> {
    let errorData = null;
    
    try {
      // تلاش برای خواندن ساختار خطای ارسال شده از سمت سرور
      errorData = await response.json();
    } catch (e) {
      // در صورتی که سرور به جای JSON، صفحه HTML (مثل خطاهای خام 500) بفرستد
      errorData = await response.text().catch(() => null);
    }

    switch (response.status) {
      case 401:
        return new UnauthorizedError(errorData?.message || 'دسترسی غیرمجاز. لطفاً وارد حساب کاربری خود شوید.');
      case 403:
        return new HttpError(403, errorData?.message || 'شما دسترسی لازم برای این عملیات را ندارید.', errorData);
      case 404:
        return new HttpError(404, errorData?.message || 'اطلاعات درخواستی یافت نشد.', errorData);
      case 408:
        return new TimeoutError('زمان پردازش درخواست در سرور به پایان رسید (HTTP 408).');
      case 429:
        return new HttpError(429, errorData?.message || 'تعداد درخواست‌های شما بیش از حد مجاز است.', errorData);
      case 500:
      case 502:
      case 503:
      case 504:
        return new HttpError(response.status, 'خطای سرور. لطفاً دقایقی دیگر مجدداً تلاش کنید.', errorData);
      default:
        return new HttpError(response.status, errorData?.message || `خطای شبکه: ${response.statusText}`, errorData);
    }
  }

  /**
   * ترجمه استثناهای پرتاب شده (مانند قطع شدن اینترنت یا تایم‌اوت مرورگر)
   */
  static mapNetworkException(error: any, timeoutMs: number = 0): BaseNetworkError {
    // اگر از قبل ترجمه شده است
    if (error instanceof BaseNetworkError) {
      return error; 
    }

    // خطای توقف توسط AbortController
    if (error.name === 'AbortError') {
      return new TimeoutError(`درخواست پس از ${timeoutMs} میلی‌ثانیه به دلیل عدم پاسخگویی متوقف شد.`);
    }

    // خطاهای سطح Fetch (مثل قطعی اینترنت یا مشکلات CORS)
    if (error instanceof TypeError) {
      return new BaseNetworkError('NETWORK_FAILURE', 'ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید.');
    }

    // خطاهای ناشناخته
    return new BaseNetworkError('UNKNOWN_ERROR', error.message || 'خطای ناشناخته‌ای در برقراری ارتباط رخ داده است.');
  }
}