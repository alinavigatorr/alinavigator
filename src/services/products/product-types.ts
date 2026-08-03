// src/services/products/product-types.ts

// ==========================================
// BRAND & CATEGORY TYPES
// ==========================================
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  imageUrl?: string;
}

// ==========================================
// PRODUCT TYPES
// ==========================================
export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface ProductAttribute {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description?: string;
  price: number;
  salePrice?: number;
  sku: string;
  brandId?: string;
  brand?: Brand;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  attributes: ProductAttribute[];
  inStock: boolean;
  stockQuantity: number;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// SEARCH & FILTER TYPES
// ==========================================
export interface ProductFilterParams {
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  // برای فیلترهای پویا مثل رنگ، سایز و غیره: { color: ['red', 'blue'] }
  attributes?: Record<string, string[]>; 
}

export interface ProductSearchParams extends ProductFilterParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: 'PRICE_ASC' | 'PRICE_DESC' | 'NEWEST' | 'POPULARITY';
}

export interface PaginatedProductResult {
  items: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// ==========================================
// INVENTORY TYPES
// ==========================================
export interface InventoryStatus {
  productId: string;
  inStock: boolean;
  quantity: number;
  estimatedRestockDate?: string;
}