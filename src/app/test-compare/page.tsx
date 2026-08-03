'use client';

import React, { useState, useEffect } from 'react';
import { X, Minus, Star, Plus, Search } from 'lucide-react';

const availableProducts = [
    { id: 'p1', title: 'کیبورد مکانیکال AliNavigatorr', price: 4500000, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=60', rating: 4.8, specs: { 'نوع سوییچ': 'قرمز (Linear)', 'نورپردازی': 'RGB کامل', 'اتصال': 'بلوتوث ۵.۰', 'باتری': '۴۰۰۰ میلی‌آمپر' } },
    { id: 'p2', title: 'کیبورد ریزر بلک‌ویدو V3', price: 5200000, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&q=60', rating: 4.5, specs: { 'نوع سوییچ': 'سبز (Tactile)', 'نورپردازی': 'RGB کامل', 'اتصال': 'دانگل ۲.۴', 'باتری': 'فست شارژ' } },
    { id: 'p3', title: 'کیبورد لاجیتک MX Mechanical', price: 6800000, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&q=60', rating: 4.9, specs: { 'نوع سوییچ': 'قهوه‌ای (Tactile)', 'نورپردازی': 'سفید یخی', 'اتصال': 'بلوتوث و دانگل', 'باتری': '۴۰۰۰ میلی‌آمپر' } },
    { id: 'p4', title: 'کیبورد کورسیر K70', price: 8100000, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=300&q=60', rating: 4.7, specs: { 'نوع سوییچ': 'قرمز (Linear)', 'نورپردازی': 'RGB کامل', 'اتصال': 'سیمی', 'باتری': 'ندارد' } },
    { id: 'p5', title: 'کیبورد کیکرون K2', price: 3900000, image: 'https://images.unsplash.com/photo-1605335153282-5ce960d70eb0?w=300&q=60', rating: 4.6, specs: { 'نوع سوییچ': 'آبی (Clicky)', 'نورپردازی': 'RGB کامل', 'اتصال': 'بلوتوث ۵.۰', 'باتری': '۴۰۰۰ میلی‌آمپر' } },
];

function MobileCompare({ products, removeProduct, openSearch, allSpecsKeys, renderSpecValue }: any) {
    const showAddColumn = products.length < 4;
    return (
        <div className="w-full border-t border-white/10 mt-4">
            <table className="w-full text-center table-fixed border-collapse">
                <thead>
                    <tr>
                        <th className="w-16 sm:w-20 p-1 border-b border-white/10 align-bottom pb-2">
                            <span className="text-[10px] text-white/40 font-normal">مشخصات</span>
                        </th>
                        {products.map((product: any) => (
                            <th key={product.id} className="p-1 sm:p-2 border-b border-white/10 border-r border-white/5 align-top relative">
                                <button onClick={() => removeProduct(product.id)} className="absolute top-1 left-1 p-1 bg-black/60 text-white/70 hover:text-red-400 rounded-md z-10">
                                    <X className="w-3 h-3" />
                                </button>
                                <div className="flex flex-col items-center">
                                    <img src={product.image} alt={product.title} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg mb-1.5" />
                                    <h3 className="text-[9px] font-bold text-white line-clamp-2 h-7 leading-tight">{product.title}</h3>
                                    <p className="text-[9px] text-white mt-1">{product.price.toLocaleString('fa-IR')}</p>
                                </div>
                            </th>
                        ))}
                        {showAddColumn && (
                            <th className="p-1 sm:p-2 border-b border-white/10 border-r border-white/5 align-top">
                                <button onClick={openSearch} className="w-full h-full min-h-[90px] flex flex-col items-center justify-center gap-1 border border-dashed border-white/20 rounded-lg bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                                    <Plus className="w-4 h-4 text-white/50" />
                                    <span className="text-[8px] text-white/50">افزودن</span>
                                </button>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {allSpecsKeys.map((key: string) => (
                        <tr key={key} className="border-b border-white/5">
                            <td className="p-2 text-[9px] font-medium text-white/50 bg-white/[0.01]">{key}</td>
                            {products.map((product: any) => (
                                <td key={`${product.id}-${key}`} className="p-2 text-[10px] border-r border-white/5">
                                    {renderSpecValue(product.specs?.[key], key)}
                                </td>
                            ))}
                            {showAddColumn && <td className="p-2 border-r border-white/5 bg-white/[0.01]"></td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TabletCompare({ products, removeProduct, openSearch, allSpecsKeys, renderSpecValue }: any) {
    const showAddColumn = products.length < 4;
    return (
        <div className="w-full border border-white/10 rounded-2xl overflow-hidden mt-6">
            <table className="w-full text-center table-fixed">
                <thead>
                    <tr>
                        <th className="w-24 p-3 border-b border-white/10 bg-white/[0.02]">
                            <span className="text-xs text-white/40 font-normal">مشخصات فنی</span>
                        </th>
                        {products.map((product: any) => (
                            <th key={product.id} className="p-4 border-b border-white/10 border-r border-white/5 align-top relative">
                                <button onClick={() => removeProduct(product.id)} className="absolute top-2 left-2 p-1.5 bg-black/50 text-white/60 hover:text-red-400 rounded-lg">
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="flex flex-col items-center">
                                    <img src={product.image} alt={product.title} className="w-16 h-16 object-cover rounded-xl mb-2" />
                                    <h3 className="text-[11px] font-bold text-white line-clamp-2 h-8">{product.title}</h3>
                                    <p className="text-[11px] text-white mt-1">{product.price.toLocaleString('fa-IR')} تومان</p>
                                </div>
                            </th>
                        ))}
                        {showAddColumn && (
                            <th className="p-4 border-b border-white/10 border-r border-white/5 align-top">
                                <button onClick={openSearch} className="w-full h-full min-h-[140px] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/10 rounded-xl hover:bg-white/[0.02] transition-colors group">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                        <Plus className="w-4 h-4 text-white/60" />
                                    </div>
                                    <span className="text-xs text-white/50">افزودن کالا</span>
                                </button>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {allSpecsKeys.map((key: string) => (
                        <tr key={key} className="hover:bg-white/[0.01]">
                            <td className="p-3 text-xs font-medium text-white/50 bg-white/[0.01] border-b border-white/5 text-right">{key}</td>
                            {products.map((product: any) => (
                                <td key={`${product.id}-${key}`} className="p-3 text-[11px] border-b border-white/5 border-r border-white/5">
                                    {renderSpecValue(product.specs?.[key], key)}
                                </td>
                            ))}
                            {showAddColumn && <td className="p-3 border-b border-white/5 border-r border-white/5"></td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function DesktopCompare({ products, removeProduct, openSearch, allSpecsKeys, renderSpecValue }: any) {
    const showAddColumn = products.length < 4;
    return (
        <div className="w-full border border-white/10 rounded-3xl overflow-hidden mt-8 shadow-2xl">
            <table className="w-full text-center table-fixed">
                <thead>
                    <tr>
                        <th className="w-48 p-6 border-b border-white/10 bg-white/[0.02]">
                            <span className="text-sm text-white/40 font-normal">مشخصات فنی</span>
                        </th>
                        {products.map((product: any) => (
                            <th key={product.id} className="p-6 border-b border-white/10 border-r border-white/5 align-top relative">
                                <button onClick={() => removeProduct(product.id)} className="absolute top-4 left-4 p-2 bg-black/40 text-white/60 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="flex flex-col items-center">
                                    <img src={product.image} alt={product.title} className="w-28 h-28 object-cover rounded-2xl mb-4 shadow-lg" />
                                    <h3 className="text-sm font-bold text-white line-clamp-2 h-10">{product.title}</h3>
                                    <div className="flex items-center gap-1 mb-2">
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        <span className="text-xs text-white">{product.rating}</span>
                                    </div>
                                    <p className="text-sm text-white mb-2">{product.price.toLocaleString('fa-IR')} تومان</p>
                                </div>
                            </th>
                        ))}
                        {showAddColumn && (
                            <th className="p-6 border-b border-white/10 border-r border-white/5 align-top">
                                <button onClick={openSearch} className="w-full h-full min-h-[240px] flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/30 transition-all group">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#14b8a6]/20 group-hover:scale-110 transition-all">
                                        <Plus className="w-6 h-6 text-white/50 group-hover:text-[#14b8a6]" />
                                    </div>
                                    <span className="text-sm text-white/50 group-hover:text-white/80">جستجو و افزودن کالا</span>
                                </button>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {allSpecsKeys.map((key: string) => (
                        <tr key={key} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-5 text-sm font-medium text-white/50 bg-white/[0.01] border-b border-white/5 text-right">{key}</td>
                            {products.map((product: any) => (
                                <td key={`${product.id}-${key}`} className="p-5 text-sm border-b border-white/5 border-r border-white/5">
                                    {renderSpecValue(product.specs?.[key], key)}
                                </td>
                            ))}
                            {showAddColumn && <td className="p-5 border-b border-white/5 border-r border-white/5"></td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function TestAdaptiveComparePage() {
    const [products, setProducts] = useState([availableProducts[0]]);
    const [windowWidth, setWindowWidth] = useState(0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const removeProduct = (id: string) => setProducts(products.filter((p) => p.id !== id));

    const addProduct = (product: any) => {
        if (products.length < 4 && !products.find(p => p.id === product.id)) {
            setProducts([...products, product]);
        }
        setIsSearchOpen(false);
    };

    const allSpecsKeys = Array.from(new Set(products.flatMap((p) => Object.keys(p.specs || {}))));

    // منطق هوشمند شمارش و رنگ‌بندی تشابه‌ها
    const renderSpecValue = (currentProductVal: string | undefined, specKey: string) => {
        if (!currentProductVal) return <Minus className="w-4 h-4 mx-auto text-white/20" />;

        // اگر فقط یک کالا داریم، مقایسه‌ای در کار نیست
        if (products.length === 1) {
            return <span className="text-white/80">{currentProductVal}</span>;
        }

        // می‌شماریم که این مقدار خاص، در چند کالای دیگر در همین ردیف تکرار شده است
        const matchCount = products.filter(p => (p.specs as any)?.[specKey] === currentProductVal).length;

        // اگر بیشتر از یک کالا این ویژگی را داشتند، یعنی وجه تشابه گروهی است (سبز می‌شود)
        if (matchCount > 1) {
            return <span className="text-[#14b8a6] font-medium">{currentProductVal}</span>;
        }

        // اگر مقدار فقط در همین کالا منحصر به فرد است، تفاوت محسوب شده و سفید و بولد می‌شود
        return <span className="text-white font-bold">{currentProductVal}</span>;
    };

    if (windowWidth === 0) return <div className="min-h-screen"></div>;

    return (
        <div className="min-h-screen pt-24 pb-20 flex flex-col items-center font-sans px-2 sm:px-8 relative" dir="rtl">
            <div className="w-full max-w-[1400px] space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl sm:text-3xl font-extrabold text-white">مقایسه کالا</h1>
                    <span className="text-xs sm:text-sm text-white/40 bg-white/5 px-3 py-1 rounded-full">
                        {products.length} از ۴ کالا
                    </span>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/20 rounded-3xl mt-10">
                        <p className="text-white/50 mb-4">هیچ کالایی برای مقایسه انتخاب نشده است.</p>
                        <button onClick={() => setIsSearchOpen(true)} className="px-6 py-2 bg-[#14b8a6]/20 text-[#14b8a6] rounded-xl hover:bg-[#14b8a6]/30 transition-colors">
                            انتخاب کالا
                        </button>
                    </div>
                ) : (
                    <>
                        {windowWidth < 768 ? (
                            <MobileCompare products={products} removeProduct={removeProduct} openSearch={() => setIsSearchOpen(true)} allSpecsKeys={allSpecsKeys} renderSpecValue={renderSpecValue} />
                        ) : windowWidth < 1024 ? (
                            <TabletCompare products={products} removeProduct={removeProduct} openSearch={() => setIsSearchOpen(true)} allSpecsKeys={allSpecsKeys} renderSpecValue={renderSpecValue} />
                        ) : (
                            <DesktopCompare products={products} removeProduct={removeProduct} openSearch={() => setIsSearchOpen(true)} allSpecsKeys={allSpecsKeys} renderSpecValue={renderSpecValue} />
                        )}
                    </>
                )}
            </div>

            {isSearchOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#121215] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <h2 className="text-white font-bold">جستجو و افزودن کالا</h2>
                            <button onClick={() => setIsSearchOpen(false)} className="p-1 text-white/50 hover:text-white bg-white/5 rounded-md">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 border-b border-white/5">
                            <div className="relative">
                                <Search className="absolute right-3 top-2.5 w-4 h-4 text-white/40" />
                                <input type="text" placeholder="نام کالا را وارد کنید..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pr-10 pl-4 text-sm text-white focus:outline-none focus:border-[#14b8a6]" />
                            </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-2">
                            {availableProducts.map(product => {
                                const isAlreadyAdded = products.some(p => p.id === product.id);
                                if (isAlreadyAdded) return null;

                                return (
                                    <button key={product.id} onClick={() => addProduct(product)} className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors text-right">
                                        <img src={product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover" />
                                        <div className="flex flex-col flex-1">
                                            <span className="text-sm font-medium text-white line-clamp-1">{product.title}</span>
                                            <span className="text-xs text-white mt-1">{product.price.toLocaleString('fa-IR')} تومان</span>
                                        </div>
                                        <Plus className="w-5 h-5 text-white/30" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}