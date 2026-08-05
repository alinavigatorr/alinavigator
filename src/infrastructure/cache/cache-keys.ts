export const CacheKeys = {
    product: (id: string) => `product:${id}`,
    category: (id: string) => `category:${id}`,
    search: (query: string) => `search:${query.toLowerCase().trim()}`,
    review: (productId: string) => `review:${productId}`,
    sellerDashboard: (sellerId: string) => `seller-dashboard:${sellerId}`,
    campaigns: () => `campaigns:active`,
    coupons: (code: string) => `coupon:${code}`,
  };