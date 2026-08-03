// src/services/orders/order-service.ts

import { OrderApi } from './order-api';
import { BaseNetworkError } from '../core/network-errors';
import {
  Order,
  CreateOrderPayload,
  OrderTimelineEvent,
  OrderTracking,
  InvoiceDetails,
} from './order-types';

// ==========================================
// NEW SERVICE RESULT PATTERN (Sprint 21)
// ==========================================
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// ==========================================
// LEGACY TYPES (Preserved for Payment UI Compatibility)
// ==========================================
/** @deprecated به زودی با تایپ Order از order-types.ts جایگزین خواهد شد */
export interface OrderDetails {
  orderId: string;
  items: Array<{ productId: string; quantity: number }>;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

/** @deprecated به زودی با ServiceResult<Order> جایگزین خواهد شد */
export interface OrderResult {
  success: boolean;
  data?: OrderDetails;
  error?: {
    code: string;
    message: string;
  };
}

export class OrderService {
  // ==========================================
  // LEGACY METHODS (Do Not Modify - Used by Payment)
  // ==========================================
  
  /**
   * @deprecated از fetchOrderById استفاده کنید.
   * جهت جلوگیری از کرش کردن بخش پرداخت، این متد دست‌نخورده باقی ماند.
   */
  async getOrder(orderId: string): Promise<OrderResult> {
    try {
      const mockOrder: OrderDetails = {
        orderId,
        items: [{ productId: 'PROD-1', quantity: 2 }],
        totalAmount: 150.00,
        status: 'PENDING'
      };
      
      return { success: true, data: mockOrder };
    } catch (error: any) {
      if (error instanceof BaseNetworkError) {
        return { success: false, error: { code: error.code, message: error.message } };
      }
      return { success: false, error: { code: 'FETCH_ORDER_FAILED', message: error.message } };
    }
  }

  // ==========================================
  // NEW ARCHITECTURE METHODS (Phase 3)
  // ==========================================

  async fetchOrderById(orderId: string): Promise<ServiceResult<Order>> {
    try {
      const data = await OrderApi.getOrderById(orderId);
      return { success: true, data };
    } catch (error: any) {
      return this.handleError(error, 'FETCH_ORDER_FAILED');
    }
  }

  async getOrders(): Promise<ServiceResult<Order[]>> {
    try {
      const data = await OrderApi.getOrders();
      return { success: true, data };
    } catch (error: any) {
      return this.handleError(error, 'FETCH_ORDERS_FAILED');
    }
  }

  async createOrder(payload: CreateOrderPayload): Promise<ServiceResult<Order>> {
    try {
      const data = await OrderApi.createOrder(payload);
      return { success: true, data };
    } catch (error: any) {
      return this.handleError(error, 'CREATE_ORDER_FAILED');
    }
  }

  async cancelOrder(orderId: string): Promise<ServiceResult<Order>> {
    try {
      const data = await OrderApi.cancelOrder(orderId);
      return { success: true, data };
    } catch (error: any) {
      return this.handleError(error, 'CANCEL_ORDER_FAILED');
    }
  }

  // ==========================================
  // TIMELINE & TRACKING
  // ==========================================

  async getOrderTimeline(orderId: string): Promise<ServiceResult<OrderTimelineEvent[]>> {
    try {
      const data = await OrderApi.getOrderTimeline(orderId);
      return { success: true, data };
    } catch (error: any) {
      return this.handleError(error, 'FETCH_TIMELINE_FAILED');
    }
  }

  async getOrderTracking(orderId: string): Promise<ServiceResult<OrderTracking>> {
    try {
      const data = await OrderApi.getOrderTracking(orderId);
      return { success: true, data };
    } catch (error: any) {
      return this.handleError(error, 'FETCH_TRACKING_FAILED');
    }
  }

  // ==========================================
  // INVOICE
  // ==========================================

  async getInvoiceDetails(orderId: string): Promise<ServiceResult<InvoiceDetails>> {
    try {
      const data = await OrderApi.getInvoiceDetails(orderId);
      return { success: true, data };
    } catch (error: any) {
      return this.handleError(error, 'FETCH_INVOICE_FAILED');
    }
  }

  async downloadInvoice(orderId: string): Promise<ServiceResult<Blob>> {
    try {
      const data = await OrderApi.downloadInvoice(orderId);
      return { success: true, data };
    } catch (error: any) {
      return this.handleError(error, 'DOWNLOAD_INVOICE_FAILED');
    }
  }

  // ==========================================
  // CENTRALIZED ERROR HANDLER
  // ==========================================

  private handleError(error: any, fallbackCode: string): ServiceResult<any> {
    if (error instanceof BaseNetworkError) {
      return { success: false, error: { code: error.code, message: error.message } };
    }
    return { 
      success: false, 
      error: { code: fallbackCode, message: error?.message || 'Unknown error occurred' } 
    };
  }
}

// Singleton export
export const orderService = new OrderService();