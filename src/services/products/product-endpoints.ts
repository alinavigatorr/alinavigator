// src/services/products/product-endpoints.ts

export const ProductEndpoints = {
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: (id: string) => `/products/${id}`,
    GET_BY_SLUG: (slug: string) => `/products/slug/${slug}`,
    SEARCH: '/products/search',
    GET_RELATED: (id: string) => `/products/${id}/related`,
  },
  CATEGORIES: {
    GET_ALL: '/categories',
    GET_BY_ID: (id: string) => `/categories/${id}`,
    GET_BY_SLUG: (slug: string) => `/categories/slug/${slug}`,
  },
  BRANDS: {
    GET_ALL: '/brands',
  },
  INVENTORY: {
    CHECK: (productId: string) => `/products/${productId}/inventory`,
  },
  FILTERS: {
    GET_ATTRIBUTES: '/products/filters/attributes',
  }
} as const;