'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Clock, TrendingUp, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../../contexts/SearchContext';
import { productService, Product } from '../../services/productService';
import { CompactProductRow } from './compact-product-row';
import { useDebounce } from '../../hooks/use-debounce'; 

const trackSearchEvent = (event: 'search_query' | 'search_click' | 'search_empty', data: any) => {
  console.debug('[Analytics]', event, data);
};

export function SearchOverlay() {
  const { isOpen, closeSearch } = useSearch(); 
  const router = useRouter();
  
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 350); 
  
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const cacheRef = useRef<Record<string, Product[]>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const premiumEase = [0.16, 1, 0.3, 1];
  const filterChips = ['جدیدترین', 'پرفروش‌ترین', 'تخفیف‌دار', 'موجود در انبار'];

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' && 
        document.activeElement?.tagName !== 'INPUT' && 
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        if (!isOpen) {
          window.dispatchEvent(new Event('open-search'));
        }
      }
      
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setTimeout(() => setQuery(''), 300); 
    }

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeSearch]);

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try { setRecentSearches(JSON.parse(stored)); } catch (e) {}
    }
    productService.getTrendingSearches().then(setTrendingSearches);
  }, []);

  const saveHistory = (newHistory: string[]) => {
    setRecentSearches(newHistory);
    localStorage.setItem('recentSearches', JSON.stringify(newHistory));
  };
  
  const removeHistoryItem = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    saveHistory(recentSearches.filter(t => t !== term));
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  useEffect(() => {
    setSelectedIndex(-1); 
    const term = debouncedQuery.trim();
    
    if (!term) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    if (cacheRef.current[term]) {
      setResults(cacheRef.current[term]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    productService.searchProducts(term)
      .then(data => {
        cacheRef.current[term] = data; 
        setResults(data);
        trackSearchEvent('search_query', { query: term, resultsCount: data.length });
      })
      .catch(error => {
        if (error.name !== 'AbortError') console.error('Search failed:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [debouncedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.trim() !== debouncedQuery.trim()) {
      setIsLoading(true);
    }
  };

  const handleSelectProduct = useCallback((product: Product) => {
    trackSearchEvent('search_click', { productId: product.id, query });
    const newRecent = [product.title, ...recentSearches.filter(t => t !== product.title)].slice(0, 5);
    saveHistory(newRecent);
    
    closeSearch();
    router.push(`/products/${product.id}`);
  }, [query, recentSearches, closeSearch, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length && !trendingSearches.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0) {
        handleSelectProduct(results[Math.max(0, selectedIndex)]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-start justify-center pt-0 sm:pt-24 px-0 sm:px-6"
          role="dialog"
          aria-modal="true"
          aria-label="جستجوی سراسری محصولات"
        >
          {/* 🌟 پس‌زمینه شیشه‌ای و بلورشده پشت مودال */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer" 
            onClick={closeSearch} 
          />
          
          {/* باکس اصلی جستجو با قابلیت شیشه‌ای و بلور */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.97, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -20 }}
            transition={{ duration: 0.35, ease: premiumEase }}
            className="relative w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-3xl sm:rounded-[24px] sm:border border-white/10 shadow-[0_30px_100px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
          >
            {/* 🌟 لایه رنگی rgb با اوپاسیتی شیشه‌ای و افکت بلور (Glassmorphism) */}
            <div style={{ backgroundColor: 'rgb(18, 21, 32)', opacity: 0.85 }} className="absolute inset-0 pointer-events-none z-0 backdrop-blur-2xl"></div>

            <div className="relative z-10 flex flex-col h-full w-full">
              <div className="flex items-center px-4 sm:px-6 h-16 sm:h-20 border-b border-white/10 shrink-0">
                <Search className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${isLoading ? 'text-[rgb(var(--primary))]' : 'text-white/40'}`} />
                
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-controls="search-results"
                  aria-activedescendant={selectedIndex >= 0 ? `result-${selectedIndex}` : undefined}
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="جستجوی محصولات، مدل‌ها و دسته‌بندی‌ها..."
                  className="flex-1 bg-transparent border-none outline-none text-white px-4 py-5 text-base sm:text-lg placeholder:text-white/30 font-medium w-full"
                  autoComplete="off"
                  spellCheck="false"
                />
                <div className="flex items-center gap-3 shrink-0">
                  <kbd className="hidden sm:inline-flex items-center justify-center px-2 h-6 text-[10px] font-bold bg-white/5 text-white/40 rounded border border-white/10 font-sans tracking-widest shadow-sm">
                    ESC
                  </kbd>
                  <button
                    onClick={closeSearch}
                    aria-label="بستن جستجو"
                    className="p-2 sm:p-2.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors active:scale-95"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              {/* چیپ‌های فیلتر سریع */}
              <div className="px-4 sm:px-6 py-3 border-b border-white/5 flex items-center gap-2 overflow-x-auto hide-scrollbar bg-white/[0.01]">
                <Filter className="w-4 h-4 text-white/30 mr-1 shrink-0" />
                {filterChips.map(chip => (
                  <button key={chip} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 hover:text-white hover:bg-[rgb(var(--primary))]/20 hover:border-[rgb(var(--primary))]/30 transition-colors">
                    {chip}
                  </button>
                ))}
              </div>

              <div 
                id="search-results"
                role="listbox"
                className="flex-1 p-3 sm:p-4 overflow-y-auto overscroll-contain" 
                ref={resultsContainerRef}
              >
                {isLoading && (
                  <div className="flex flex-col gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-3.5 rounded-[var(--radius-md)] border border-transparent">
                        <div className="w-14 h-14 bg-white/5 rounded-[var(--radius-sm)] animate-pulse shrink-0"></div>
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse"></div>
                          <div className="h-3 w-1/4 bg-white/5 rounded animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!query && !isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 p-2 pt-4">
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest">
                            <Clock className="w-4 h-4" /> تاریخچه جستجو
                          </div>
                          <button onClick={clearHistory} className="text-xs text-[rgb(var(--primary))] hover:underline">پاک کردن همه</button>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {recentSearches.map((term, i) => (
                            <div key={i} className="flex items-center px-1 py-1 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 shadow-sm transition-colors group">
                              <button onClick={() => setQuery(term)} className="px-3 text-sm text-white/80">
                                {term}
                              </button>
                              <button onClick={(e) => removeHistoryItem(e, term)} className="p-1.5 rounded-full text-white/20 hover:text-white hover:bg-white/10 transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-[rgb(var(--primary))]/70 mb-4 uppercase tracking-widest">
                        <TrendingUp className="w-4 h-4" /> بیشترین جستجوها
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {trendingSearches.map((term, i) => (
                          <button key={i} onClick={() => setQuery(term)} className="px-4 py-2 bg-[rgb(var(--primary))]/10 hover:bg-[rgb(var(--primary))]/20 rounded-full text-sm text-[rgb(var(--primary))] transition-colors border border-[rgb(var(--primary))]/20 shadow-sm font-medium">
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {query && !isLoading && results.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center px-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-5">
                      <Search className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-white mb-2 font-semibold text-lg">محصولی برای «{query}» پیدا نشد</p>
                    <p className="text-sm text-white/40 max-w-sm leading-relaxed">ممکن است تولید این محصول متوقف شده باشد یا املای آن متفاوت باشد. پیشنهاد می‌کنیم از کلمات کلیدی کلی‌تر استفاده کنید.</p>
                  </motion.div>
                )}

                {query && !isLoading && results.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-1">
                    {results.map((product, idx) => (
                      <div id={`result-${idx}`} key={product.id}>
                        <CompactProductRow 
                          id={product.id}
                          title={product.title}
                          price={product.formattedPrice}
                          category={product.category}
                          searchQuery={debouncedQuery} 
                          isActive={idx === selectedIndex}
                          onClick={() => handleSelectProduct(product)}
                        />
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}