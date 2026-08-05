'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { Container } from '../../components/ui/container';
import { Button } from '../../components/ui/button';
import { ProductCard } from '../../components/ui/product-card';
import { ProductSkeleton } from '../../components/ui/product-skeleton';
import { productService, Product } from '../../services/productService';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronLeft, SlidersHorizontal, AlertCircle, RotateCcw } from 'lucide-react';

export default function ProductListingPage() {
  const shouldReduceMotion = useReducedMotion();
  const [, startTransition] = useTransition();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(20000000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  useEffect(() => {
    async function loadMeta() {
      try {
        const [cats, brds] = await Promise.all([
          productService.getCategories(),
          productService.getBrands(),
        ]);
        setCategories(cats);
        setBrands(brds);
      } catch (err) {
        console.error(err);
      }
    }
    loadMeta();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts({
        category: selectedCategory,
        brand: selectedBrand,
        maxPrice,
        inStockOnly,
        sortBy,
      });
      setProducts(data);
    } catch {
      setError('خطا در بارگذاری محصولات. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startTransition(() => {
      fetchProducts();
    });
  }, [selectedCategory, selectedBrand, maxPrice, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMaxPrice(20000000);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0) +
    (maxPrice < 20000000 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const FilterContent = () => (
    <>
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <h2 className="font-bold text-white flex items-center gap-2"><Filter className="w-4 h-4 text-[#14b8a6]" /> فیلتر محصولات</h2>
        {activeFiltersCount > 0 && <button onClick={resetFilters} className="text-xs text-[#14b8a6] hover:underline">بازنشانی</button>}
      </div>
      
      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-semibold text-white/80">دسته‌بندی</h3>
        <div className="space-y-1.5">
          <button onClick={() => setSelectedCategory('all')} className={`w-full text-right text-sm px-3 py-2 rounded-xl transition-colors ${selectedCategory === 'all' ? 'bg-[#14b8a6]/20 text-[#14b8a6] font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>همه دسته‌ها</button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full text-right text-sm px-3 py-2 rounded-xl transition-colors ${selectedCategory === cat ? 'bg-[#14b8a6]/20 text-[#14b8a6] font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>{cat}</button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3 pt-4 border-t border-white/10">
        <h3 className="text-sm font-semibold text-white/80">برند سازنده</h3>
        <div className="space-y-1.5">
          <button onClick={() => setSelectedBrand('all')} className={`w-full text-right text-sm px-3 py-2 rounded-xl transition-colors ${selectedBrand === 'all' ? 'bg-[#14b8a6]/20 text-[#14b8a6] font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>همه برندها</button>
          {brands.map((brand) => (
            <button key={brand} onClick={() => setSelectedBrand(brand)} className={`w-full text-right text-sm px-3 py-2 rounded-xl transition-colors ${selectedBrand === brand ? 'bg-[#14b8a6]/20 text-[#14b8a6] font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>{brand}</button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3 pt-4 border-t border-white/10">
        <h3 className="text-sm font-semibold text-white/80">محدوده قیمت</h3>
        <input type="range" min="500000" max="20000000" step="500000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#14b8a6] cursor-pointer" />
        <div className="flex justify-between text-xs text-white/50"><span>۰</span><span>{maxPrice.toLocaleString()} تومان</span></div>
      </div>
      
      <div className="space-y-3 pt-4 border-t border-white/10 pb-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="rounded border-white/20 bg-black text-[#14b8a6] focus:ring-[#14b8a6] focus:ring-offset-0 w-4 h-4 cursor-pointer" />
          <span className="text-sm text-white/70">فقط کالاهای موجود</span>
        </label>
      </div>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen pt-[120px] pb-20">
      <Container>
        
        <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
          <Link href="/" className="hover:text-white transition-colors">خانه</Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-white font-medium">محصولات</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">کاتالوگ محصولات حرفه‌ای</h1>
            <p className="text-white/60 text-sm">مجموعه‌ای از بهترین تجهیزات سخت‌افزاری و قطعات کاستوم</p>
          </div>
          <div className="flex items-center gap-4 justify-between md:justify-end">
            <button onClick={() => setMobileFilterOpen(true)} className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
              <SlidersHorizontal className="w-4 h-4 text-[#14b8a6]" />
              فیلترها {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/50 whitespace-nowrap">مرتب‌سازی:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'rating')} className="bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#14b8a6] transition-colors cursor-pointer">
                <option value="featured">پیش‌فرض (ویژه)</option>
                <option value="price-asc">ارزان‌ترین</option>
                <option value="price-desc">گران‌ترین</option>
                <option value="rating">بالاترین امتیاز</option>
              </select>
            </div>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-white/40">فیلترهای فعال:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/30 text-xs text-[#14b8a6]">
                دسته‌بندی: {selectedCategory} <button onClick={() => setSelectedCategory('all')}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            {selectedBrand !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/30 text-xs text-[#14b8a6]">
                برند: {selectedBrand} <button onClick={() => setSelectedBrand('all')}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            {maxPrice < 20000000 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/30 text-xs text-[#14b8a6]">
                زیر {maxPrice.toLocaleString()} تومان <button onClick={() => setMaxPrice(20000000)}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/30 text-xs text-[#14b8a6]">
                فقط موجود <button onClick={() => setInStockOnly(false)}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            <button onClick={resetFilters} className="text-xs text-white/50 hover:text-white underline ml-2 transition-colors">حذف همه</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <aside className="hidden lg:block lg:col-span-1 bg-white/[0.02] border border-white/5 p-6 rounded-2xl h-fit sticky top-[100px]">
            <FilterContent />
          </aside>

          <main className="lg:col-span-3">
            {error && (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">خطا در بارگذاری</h3>
                <p className="text-sm text-white/60 mb-6">{error}</p>
                <Button onClick={fetchProducts} className="gap-2"><RotateCcw className="w-4 h-4" /> تلاش مجدد</Button>
              </div>
            )}
            
            {loading && !error && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            )}
            
            {!loading && !error && products.length === 0 && (
              <div className="flex flex-col items-center justify-center p-16 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4"><Filter className="w-8 h-8 text-white/30" /></div>
                <h3 className="text-xl font-bold text-white mb-2">محصولی یافت نشد</h3>
                <p className="text-sm text-white/60 mb-6">فیلترها را تغییر دهید.</p>
                <Button variant="secondary" onClick={resetFilters}>بازنشانی فیلترها</Button>
              </div>
            )}
            
            {!loading && !error && products.length > 0 && (
              <motion.div initial={shouldReduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id} 
                    title={product.title} 
                    price={product.formattedPrice} 
                    category={product.category} 
                    rating={product.rating} 
                    badge={product.badge} 
                  />
                ))}
              </motion.div>
            )}
          </main>
        </div>
      </Container>

      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileFilterOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden" />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-[#111115] border-t border-white/10 rounded-t-3xl z-50 md:hidden flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.5)]"
            >
              <div className="p-6 overflow-y-auto overscroll-contain flex-1">
                <FilterContent />
              </div>
              <div className="p-4 border-t border-white/10 shrink-0 bg-[#0F0F13]">
                <button onClick={() => setMobileFilterOpen(false)} className="w-full py-3.5 rounded-xl bg-[#14b8a6] text-black font-bold text-lg active:scale-95 transition-transform">
                  اعمال فیلترها
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}