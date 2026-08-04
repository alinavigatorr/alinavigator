// src/services/products/product-service.ts

import { ProductApi } from './product-api';
import { BaseNetworkError } from '../core/network-errors';
import {
  Product,
  PaginatedProductResult,
  ProductSearchParams,
  Category,
  Brand,
  InventoryStatus
} from './product-types';

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
// LEGACY TYPES (Preserved for UI/Cart Compatibility)
// ==========================================
/** @deprecated به زودی با تایپ Product از product-types.ts جایگزین خواهد شد */
export interface ProductDetails {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

/** @deprecated به زودی با ServiceResult<Product> جایگزین خواهد شد */
export interface ProductResult {
  success: boolean;
  data?: ProductDetails;
  error?: {
    code: string;
    message: string;
  };
}

export class ProductService {
  // ==========================================
  // LEGACY METHODS (Do Not Modify - Used by Cart/UI)
  // ==========================================
  
  /**
   * @deprecated از fetchProductById استفاده کنید.
   * جهت جلوگیری از کرش کردن بخش کاتالوگ و سبد خرید، این متد دست‌نخورده باقی ماند.
   */
  async getProduct(productId: string): Promise<ProductResult> {
    try {
      // SIMULATED MOCK (جهت حفظ وضعیت فریم‌ورک-ردی)
      const mockProduct: ProductDetails = {
        id: productId,
        name: 'Sample Product',
        price: 99.99,
        inStock: true
      };
      
      return { success: true, data: mockProduct };
    } catch (error: any) {
      if (error instanceof BaseNetworkError) {
        return { success: false, error: { code: error.code, message: error.message } };
      }
      return { success: false, error: { code: 'FETCH_PRODUCT_FAILED', message: error.message } };
    }
  }

  // ==========================================
  // NEW ARCHITECTURE METHODS (Phase 4)
  // ==========================================

  async fetchProducts(params?: ProductSearchParams): Promise<ServiceResult<PaginatedProductResult>> {
    try {
      const data = await ProductApi.getProducts(params);
      return { success: true, data };
    } catch (error: any) {
      return this.handleError(error, 'FETCH_PRODUCTS_FAILED');
    }
  }

  async fetchProductById(id: string): Promise<ServiceResult<Product>> {
    try {
      const data = await ProductApi.getProductById(id);
      return { success: true, data };
    } catch (error: any) {
      return this.handleError(error, 'FETCH_PRODUCT_BY_ID_FAILED');
    }
  }

  async fetchProductBySlug(slug: string): Promise<ServiceResult<Product>> {
    try {
      const data = await ProductApi.getProductBySlug(slug);
      return { success: true, data };
    } catch (error: any) {
      return this.handleError(error, 'FETCH_PRODUCT_BY_SLUG_FAILED');
    }
  }

  async searchProducts(params: ProductSearchParams): Promise<ServiceResult<PaginatedProductResult>> {
    try {
      const data = await ProductApi.searchProducts(params);
      return { success: true, data };
    } catch (error: any) {
      return this.handleError(error, 'SEARCH_PRODUCTS_FAILED');
    }
  }

  // ==========================================
  // CATEGORIES & BRANDS
  // ==========================================

  async fetchCategories(): Promise<ServiceResult<Category[]>> {
    try {
      const data = await ProductApi.getCategories();
      return { success: true, data };
    } catch (error: any) {
      return this.handleError(error, 'FETCH_CATEGORIES_FAILED');
    }
  }

  async fetchBrands(): Promise<ServiceResult<Brand[]>> {
    try {
      const data = await ProductApi.getBrands();
      return { success: true, data };
    } catch (error: any) {
      return this.handleError(error, 'FETCH_BRANDS_FAILED');
    }
  }

  // ==========================================
  // INVENTORY
  // ==========================================

  async checkInventory(productId: string): Promise<ServiceResult<InventoryStatus>> {
    try {
      const data = await ProductApi.checkInventory(productId);
      return { success: true, data };
    } catch (error: any) {
      return this.handleError(error, 'CHECK_INVENTORY_FAILED');
    }
  }

  // ==========================================
  // COMPARISON MOCK DATA (Sprint 23 Phase 4)
  // ==========================================
  
  async getMockProductsForComparison(): Promise<ServiceResult<any[]>> {
    // This perfectly mimics a future API call. The data is statically generated here
    // for this phase, so the UI is fully disconnected from hardcoding.
    const mockProducts = [
      {
        id: 'p1', categoryId: 'laptops', name: 'MacBook Pro 16"', brand: 'Apple', price: 2499, image: 'https://picsum.photos/seed/mac/200/200',
        specs: {
          'Core Components': { 'Display': '16" Liquid Retina XDR', 'CPU': 'Apple M3 Max', 'GPU': '40-core GPU', 'RAM': '32GB LPDDR5', 'Storage': '1TB NVMe SSD' },
          'Physical & Power': { 'Weight': '2.16 kg', 'Battery': '100Wh', 'Dimensions': '35.5 x 24.8 x 1.6 cm' },
          'General': { 'Operating System': 'macOS Sonoma', 'Warranty': '1 Year International' }
        }
      },
      {
        id: 'p2', categoryId: 'laptops', name: 'XPS 15 OLED', brand: 'Dell', price: 1999, image: 'https://picsum.photos/seed/dell/200/200',
        specs: {
          'Core Components': { 'Display': '15.6" 3.5K OLED', 'CPU': 'Intel Core i9-13900H', 'GPU': 'NVIDIA RTX 4070', 'RAM': '32GB LPDDR5', 'Storage': '1TB NVMe SSD' },
          'Physical & Power': { 'Weight': '1.92 kg', 'Battery': '86Wh', 'Dimensions': '34.4 x 23.0 x 1.8 cm' },
          'General': { 'Operating System': 'Windows 11 Pro', 'Warranty': '1 Year International' }
        }
      },
      {
        id: 'p3', categoryId: 'laptops', name: 'ThinkPad X1', brand: 'Lenovo', price: 1899, image: 'https://picsum.photos/seed/lenovo/200/200',
        specs: {
          'Core Components': { 'Display': '14" WUXGA IPS', 'CPU': 'Intel Core i7-1355U', 'GPU': 'Intel Iris Xe', 'RAM': '32GB LPDDR5' },
          'Physical & Power': { 'Weight': '1.12 kg', 'Battery': '57Wh', 'Dimensions': '31.5 x 22.2 x 1.5 cm' },
          'General': { 'Operating System': 'Windows 11 Pro', 'Warranty': '1 Year International' }
        }
      },
      {
        id: 'p4', categoryId: 'laptops', name: 'Blade 15 Advanced', brand: 'Razer', price: 2299, image: 'https://picsum.photos/seed/razer/200/200',
        specs: {
          'Core Components': { 'Display': '15.6" QHD 240Hz', 'CPU': 'Intel Core i7-13800H', 'GPU': 'NVIDIA RTX 4080', 'RAM': '32GB LPDDR5', 'Storage': '1TB NVMe SSD' },
          'Physical & Power': { 'Weight': '2.01 kg', 'Battery': '80Wh', 'Dimensions': '35.5 x 23.5 x 1.6 cm' },
          'General': { 'Operating System': 'Windows 11 Home', 'Warranty': '1 Year International' }
        }
      }
    ];

    return { success: true, data: mockProducts };
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
export const productService = new ProductService();