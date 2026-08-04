// src/services/core/network/network-logger.ts

/**
 * سطح‌بندی لاگ‌ها برای کنترل بهتر خروجی در کنسول
 */
 export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'NONE';

 export class NetworkLogger {
   private level: LogLevel = 'NONE';
   private isDev: boolean;
 
   constructor() {
     // فقط در محیط توسعه لاگ‌ها فعال می‌شوند
     this.isDev = process.env.NODE_ENV === 'development';
     if (this.isDev) {
       this.level = 'DEBUG'; // پیش‌فرض در دولوپمنت
     }
   }
 
   setLevel(level: LogLevel): void {
     this.level = level;
   }
 
   logRequest(method: string, url: string, headers?: HeadersInit, body?: any): void {
     if (!this.isDev || this.level === 'NONE' || this.level === 'ERROR') return;
 
     console.groupCollapsed(`[NETWORK: REQ] ${method.toUpperCase()} ${url}`);
     console.log('Headers:', headers);
     if (body) console.log('Body:', body);
     console.groupEnd();
   }
 
   logResponse(status: number, url: string, responseTimeMs: number, data?: any): void {
     if (!this.isDev || this.level === 'NONE' || this.level === 'ERROR') return;
 
     const isSuccess = status >= 200 && status < 300;
     const label = isSuccess ? 'RES_OK' : 'RES_ERR';
     const css = isSuccess ? 'color: green; font-weight: bold;' : 'color: red; font-weight: bold;';
 
     console.groupCollapsed(`%c[NETWORK: ${label}] ${status} | ${url} (${responseTimeMs}ms)`, css);
     if (data) console.log('Data:', data);
     console.groupEnd();
   }
 
   logError(url: string, error: Error | any): void {
     if (!this.isDev || this.level === 'NONE') return;
 
     console.error(`[NETWORK: FAIL] ${url}`, error);
   }
 }
 
 // Singleton export
 export const networkLogger = new NetworkLogger();