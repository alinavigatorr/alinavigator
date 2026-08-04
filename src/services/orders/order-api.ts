// src/services/orders/order-api.ts

import { httpClient } from '../core/http-client';
import { OrderEndpoints } from './order-endpoints';
import {
  Order,
  CreateOrderPayload,
  OrderTimelineEvent,
  OrderTracking,
  InvoiceDetails,
} from './order-types';

export class OrderApi {
  // ==========================================
  // ORDER MANAGEMENT
  // ==========================================
  
  static async getOrders(): Promise<Order[]> {
    return httpClient.get<Order[]>(OrderEndpoints.GET_ALL);
  }

  static async getOrderById(id: string): Promise<Order> {
    return httpClient.get<Order>(OrderEndpoints.GET_BY_ID(id));
  }

  static async createOrder(payload: CreateOrderPayload): Promise<Order> {
    return httpClient.post<Order>(OrderEndpoints.CREATE, payload);
  }

  static async cancelOrder(id: string): Promise<Order> {
    return httpClient.patch<Order>(OrderEndpoints.CANCEL(id), {});
  }

  // ==========================================
  // TIMELINE & TRACKING
  // ==========================================
  
  static async getOrderTimeline(id: string): Promise<OrderTimelineEvent[]> {
    return httpClient.get<OrderTimelineEvent[]>(OrderEndpoints.GET_TIMELINE(id));
  }

  static async getOrderTracking(id: string): Promise<OrderTracking> {
    return httpClient.get<OrderTracking>(OrderEndpoints.GET_TRACKING(id));
  }

  // ==========================================
  // INVOICE
  // ==========================================
  
  static async getInvoiceDetails(id: string): Promise<InvoiceDetails> {
    return httpClient.get<InvoiceDetails>(OrderEndpoints.GET_INVOICE_DETAILS(id));
  }

  /**
   * این متد برای دانلود مستقیم فایل فاکتور (مثلاً PDF) استفاده می‌شود.
   * به جای برگرداندن JSON، معمولاً Blob یا ArrayBuffer برمی‌گرداند.
   */
  static async downloadInvoice(id: string): Promise<Blob> {
    return httpClient.get<Blob>(OrderEndpoints.DOWNLOAD_INVOICE(id), {
      // این تنظیم به HttpClient می‌گوید که انتظار فایل باینری داریم، نه JSON
      headers: { Accept: 'application/pdf' }, 
      responseType: 'blob' 
    });
  }
}