// مسیر: src/services/products/product-api.ts

import { httpClient } from '@/core/http-client'; // اصلاح مسیر به @/core/http-client
import { ProductEndpoints } from './product-endpoints';
import {
  Product,
  PaginatedProductResult,
  ProductSearchParams,
  Category,
  Brand,
  InventoryStatus
} from './product-types';

export class ProductApi {
  // ==========================================
  // PRODUCTS
  // ==========================================

  static async getProducts(params?: ProductSearchParams): Promise<PaginatedProductResult> {
    return httpClient.get<PaginatedProductResult>(ProductEndpoints.PRODUCTS.GET_ALL, { params });
  }

  static async getProductById(id: string): Promise<Product> {
    return httpClient.get<Product>(ProductEndpoints.PRODUCTS.GET_BY_ID(id));
  }

  static async getProductBySlug(slug: string): Promise<Product> {
    return httpClient.get<Product>(ProductEndpoints.PRODUCTS.GET_BY_SLUG(slug));
  }

  static async searchProducts(params: ProductSearchParams): Promise<PaginatedProductResult> {
    return httpClient.get<PaginatedProductResult>(ProductEndpoints.PRODUCTS.SEARCH, { params });
  }

  static async getRelatedProducts(id: string): Promise<Product[]> {
    return httpClient.get<Product[]>(ProductEndpoints.PRODUCTS.GET_RELATED(id));
  }

  // ==========================================
  // CATEGORIES & BRANDS
  // ==========================================

  static async getCategories(): Promise<Category[]> {
    return httpClient.get<Category[]>(ProductEndpoints.CATEGORIES.GET_ALL);
  }

  static async getCategoryBySlug(slug: string): Promise<Category> {
    return httpClient.get<Category>(ProductEndpoints.CATEGORIES.GET_BY_SLUG(slug));
  }

  static async getBrands(): Promise<Brand[]> {
    return httpClient.get<Brand[]>(ProductEndpoints.BRANDS.GET_ALL);
  }

  // ==========================================
  // INVENTORY
  // ==========================================

  static async checkInventory(productId: string): Promise<InventoryStatus> {
    return httpClient.get<InventoryStatus>(ProductEndpoints.INVENTORY.CHECK(productId));
  }
}