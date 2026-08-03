// src/services/orders/order-endpoints.ts

export const OrderEndpoints = {
  // مدیریت سفارشات
  GET_ALL: '/orders',
  GET_BY_ID: (id: string) => `/orders/${id}`,
  CREATE: '/orders',
  CANCEL: (id: string) => `/orders/${id}/cancel`,
  
  // تایم‌لاین و وضعیت
  GET_TIMELINE: (id: string) => `/orders/${id}/timeline`,
  
  // پیگیری مرسوله (Tracking)
  GET_TRACKING: (id: string) => `/orders/${id}/tracking`,
  
  // فاکتور (Invoice)
  DOWNLOAD_INVOICE: (id: string) => `/orders/${id}/invoice/download`,
  GET_INVOICE_DETAILS: (id: string) => `/orders/${id}/invoice`,
} as const;