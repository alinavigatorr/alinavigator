// src/services/core/network/response-parser.ts

export class ResponseParser {
  /**
   * تبدیل پاسخ خام Fetch به دیتای قابل استفاده بر اساس هدر Content-Type
   */
  static async parse<T>(response: Response): Promise<T> {
    // 204 No Content (بدون محتوا، مثلاً پس از یک درخواست DELETE موفق)
    if (response.status === 204) {
      return {} as unknown as T;
    }

    const contentType = response.headers.get('content-type') || '';

    // پردازش پاسخ‌های JSON (بیشترین استفاده)
    if (contentType.includes('application/json')) {
      return (await response.json()) as T;
    }

    // پردازش فایل‌ها (دانلود PDF، تصاویر، اکسل و ...)
    if (
      contentType.includes('application/pdf') ||
      contentType.includes('image/') ||
      contentType.includes('application/octet-stream') ||
      contentType.includes('application/vnd.')
    ) {
      return (await response.blob()) as unknown as T;
    }

    // پردازش متن‌های ساده یا HTML
    if (contentType.includes('text/plain') || contentType.includes('text/html')) {
      return (await response.text()) as unknown as T;
    }

    // حالت پشتیبان (Fallback) برای زمانی که سرور هدر Content-Type را ارسال نکرده است
    const rawText = await response.text();
    try {
      // شانس خود را برای پارس کردن به عنوان JSON امتحان می‌کنیم
      return JSON.parse(rawText) as T;
    } catch {
      // در غیر این صورت همان متن خام را برمی‌گردانیم
      return rawText as unknown as T;
    }
  }
}