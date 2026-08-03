export interface Product {
  id: string;
  title: string;
  price: number;
  formattedPrice: string;
  category: string;
  rating: number;
  badge?: string;
  description?: string;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating';
}

const mockProducts: Product[] = [
  { id: 'p1', title: 'فرمان بازی لاجیتک G923 TrueForce', price: 18500000, formattedPrice: '۱۸,۵۰۰,۰۰۰', category: 'شبیه‌ساز رانندگی', rating: 4.8, badge: 'پیشنهاد ویژه' },
  { id: 'p2', title: 'میکروفون داینامیک Shure MV7X', price: 11200000, formattedPrice: '۱۱,۲۰۰,۰۰۰', category: 'تجهیزات استودیو', rating: 5.0 },
  { id: 'p3', title: 'استند فلزی کاستوم مگ‌سیف (رنگ مشکی مات)', price: 14500000, formattedPrice: '۱,۴۵۰,۰۰۰', category: 'طراحی اختصاصی', rating: 4.9 },
  { id: 'p4', title: 'کیت تعمیر و تمیزکننده موتور هاب اسکوتر', price: 8500000, formattedPrice: '۸۵۰,۰۰۰', category: 'قطعات موتور', rating: 4.5 },
  { id: 'p5', title: 'پلتفرم X-UI Core ابری', price: 5000000, formattedPrice: 'اشتراکی', category: 'شبکه و سرور', rating: 4.9 },
  { id: 'p6', title: 'پایه اسپیکر رومیزی لیزرکات', price: 2100000, formattedPrice: '۲,۱۰۰,۰۰۰', category: 'طراحی اختصاصی', rating: 4.7 }
];

export const productService = {
  async getCategories(): Promise<string[]> {
    return ['شبیه‌ساز رانندگی', 'تجهیزات استودیو', 'طراحی اختصاصی', 'قطعات موتور', 'شبکه و سرور', 'لوازم جانبی', 'تجهیزات استریم'];
  },
  
  async getBrands(): Promise<string[]> {
    return ['Logitech G', 'SHURE', 'Custom Build', 'X-UI'];
  },

  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    let results = [...mockProducts];
    
    if (filters?.category && filters.category !== 'all') {
      results = results.filter(p => p.category === filters.category);
    }
    if (filters?.maxPrice) {
      results = results.filter(p => p.price <= filters.maxPrice!);
    }
    
    if (filters?.sortBy === 'price-asc') results.sort((a, b) => a.price - b.price);
    if (filters?.sortBy === 'price-desc') results.sort((a, b) => b.price - a.price);
    
    return results;
  },

  async getProductById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 800)); 
    if (id === 'error' || id === 'not-found') return null;

    const found = mockProducts.find(p => p.id === id);
    if (found) {
       return { ...found, description: 'این یک متن تستی برای بررسی ساختار و تایپوگرافی صفحه جزئیات محصول است. در این فاز صرفاً Layout و جانمایی عناصر بررسی می‌شود.' };
    }
    
    return {
      id: id,
      title: 'محصول تستی (اسکلت‌بندی صفحه)',
      price: 18500000,
      formattedPrice: '۱۸,۵۰۰,۰۰۰',
      category: 'تجهیزات سخت‌افزاری',
      rating: 4.8,
      badge: 'موجود در انبار',
      description: 'این یک متن تستی برای بررسی ساختار و تایپوگرافی صفحه جزئیات محصول است.',
    };
  },

  async getRelatedProducts(category: string, limit: number = 4): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts.slice(0, limit);
  },

  // --- متدهای جدید اضافه شده برای اسپرینت ۶ (جستجو) ---

  /**
   * جستجوی محصولات بر اساس عبارت ورودی در عنوان یا دسته‌بندی
   */
  async searchProducts(query: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 300)); // شبیه‌سازی تاخیر جستجوی دیتابیس
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return mockProducts.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.category.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * دریافت عبارت‌های پرجستجو به صورت داینامیک
   */
  async getTrendingSearches(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return ['فرمان بازی', 'استند مگ‌سیف', 'میکروفون', 'X-UI'];
  }
};