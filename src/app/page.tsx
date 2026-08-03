'use client';

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { Container } from "../components/ui/container";
import { Button } from "../components/ui/button";
import { MonitorPlay, Mic, Wrench, Bike, ChevronLeft, Zap, ShoppingBag, Heart } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useWishlist } from '../contexts/WishlistContext'; // 👈 اضافه شدن هوک علاقه‌مندی‌ها

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const viewportConfig = { once: true, margin: "-40px" };
  const smoothTransition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

  // 👈 دریافت توابع علاقه‌مندی‌ها از کانتکست
  const { isInWishlist, toggleItem } = useWishlist();

  // ثبت زنده بازدیدهای اخیر
  const [recentItems, setRecentItems] = useState<any[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem('alinavigator_recent_items');
    if (stored) {
      try { setRecentItems(JSON.parse(stored)); } catch (e) {}
    }
  }, []);

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: smoothTransition },
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      
      {/* لایه بکگراند خالص و رنگ اختصاصی */}
      <div className="absolute inset-0 bg-[#000000] -z-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[rgb(31,39,61)] opacity-45 -z-10 pointer-events-none"></div>

      {/* 1. بخش هیرو (Hero) */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#14b8a6]/10 rounded-full blur-[120px] opacity-70 pointer-events-none"></div>

        <Container className="relative z-10 text-center">
          <motion.div 
            variants={staggerContainer}
            initial={shouldReduceMotion ? false : "initial"}
            animate={shouldReduceMotion ? undefined : "animate"}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-[#f43f5e] animate-pulse"></span>
                <span className="text-xs font-medium text-white/80">کالکشن جدید پاییز آماده تحویل است</span>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                تجهیزات حرفه‌ای، <br className="hidden md:block" />
                برای خلق <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9]">ایده‌های بی‌پایان</span>
              </h1>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                از قدرتمندترین سیستم‌های گیمینگ تا قطعات شخصی‌سازی شده با بالاترین دقت طراحی. هر آنچه برای ارتقای ستاپ خود نیاز دارید، اینجاست.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <motion.div whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }} className="w-full sm:w-auto">
                <Link href="/products" className="w-full block">
                  <Button size="lg" className="w-full text-base transition-all duration-300 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                    مشاهده محصولات
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }} className="w-full sm:w-auto">
                <Link href="/custom-builds" className="w-full block">
                  <Button size="lg" variant="secondary" className="w-full text-base transition-all duration-300 hover:bg-white/20">
                    کاستوم بیلدها <ChevronLeft className="mr-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* بخش لوگوها */}
      <section className="border-y border-white/5 bg-white/[0.02] py-8 overflow-hidden">
        <Container>
          <motion.div 
            variants={staggerContainer}
            initial={shouldReduceMotion ? false : "initial"}
            whileInView={shouldReduceMotion ? undefined : "animate"}
            viewport={viewportConfig}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
          >
            {[
              { name: "Logitech G", font: "font-serif tracking-wider" },
              { name: "SHURE", font: "tracking-widest" },
              { name: "AUTODESK", font: "italic" },
              { name: "X-UI CORE", font: "flex items-center gap-1", icon: <Zap className="w-5 h-5"/> }
            ].map((brand, i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={shouldReduceMotion ? undefined : { opacity: 1, scale: 1.05 }} className={`text-xl font-bold text-white opacity-40 hover:opacity-100 transition-opacity duration-300 ${brand.font}`}>
                {brand.icon}{brand.name}
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* دسته‌بندی‌های محبوب */}
      <section className="py-24">
        <Container>
          <motion.div 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={smoothTransition}
            className="flex items-center justify-between mb-12"
          >
            <h2 className="text-3xl font-bold text-white">دسته‌بندی‌های محبوب</h2>
            <Link href="/categories">
              <Button variant="ghost" className="hidden sm:flex hover:text-[#14b8a6] transition-colors">مشاهده همه</Button>
            </Link>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial={shouldReduceMotion ? false : "initial"}
            whileInView={shouldReduceMotion ? undefined : "animate"}
            viewport={viewportConfig}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {[
              { name: "گیمینگ و استریم", icon: <MonitorPlay className="w-8 h-8 mb-4 text-[#14b8a6]" /> },
              { name: "تجهیزات استودیو", icon: <Mic className="w-8 h-8 mb-4 text-[#0ea5e9]" /> },
              { name: "قطعات لیزرکات", icon: <Wrench className="w-8 h-8 mb-4 text-[#f43f5e]" /> },
              { name: "قطعات اسکوتر", icon: <Bike className="w-8 h-8 mb-4 text-[#f59e0b]" /> },
            ].map((cat, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.01 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={smoothTransition}
                className="w-[160px] md:w-auto shrink-0 snap-center group cursor-pointer flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#14b8a6]/40 hover:shadow-[0_0_25px_rgba(20,184,166,0.15)] transition-all duration-300"
              >
                {cat.icon}
                <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{cat.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* محصولات ویژه */}
      <section className="py-12">
        <Container>
          <motion.div 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={smoothTransition}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-3xl font-bold text-white">محصولات ویژه</h2>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial={shouldReduceMotion ? false : "initial"}
            whileInView={shouldReduceMotion ? undefined : "animate"}
            viewport={viewportConfig}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {[
              { id: "feat-1", title: "فرمان بازی لاجیتک G923 TrueForce", price: "۱۸,۵۰۰,۰۰۰ تومان", category: "شبیه‌ساز رانندگی" },
              { id: "feat-2", title: "میکروفون داینامیک Shure MV7X", price: "۱۱,۲۰۰,۰۰۰ تومان", category: "تجهیزات استودیو" },
              { id: "feat-3", title: "استند فلزی کاستوم مگ‌سیف", price: "۱,۴۵۰,۰۰۰ تومان", category: "طراحی اختصاصی" },
              { id: "feat-4", title: "کیت تعمیر موتور هاب اسکوتر", price: "۸۵۰,۰۰۰ تومان", category: "قطعات موتور" },
            ].map((item, idx) => {
              // 👈 بررسی اینکه آیا محصول لایک شده است یا خیر
              const liked = isInWishlist(item.id);

              return (
                <motion.div key={idx} variants={fadeInUp} className="w-[200px] sm:w-[220px] md:w-auto shrink-0 snap-center">
                  <Link href={`/products/${item.id}`} className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex flex-col hover:border-[#14b8a6]/40 hover:bg-white/[0.04] transition-all h-full">
                    
                    {/* 👈 دکمه قلب متصل به کانتکست با استایل قرمز رنگ مشابه ProductCard */}
                    <button 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        e.stopPropagation(); 
                        toggleItem(item.id);
                      }} 
                      className="absolute top-5 left-5 z-10 p-2 rounded-full bg-black/40 backdrop-blur-sm transition-all hover:scale-110"
                      title={liked ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                    >
                      <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-white/70 hover:text-white'}`} />
                    </button>

                    <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-white/5 mb-3 flex items-center justify-center text-xs text-white/30">
                      تصویر محصول
                    </div>

                    <span className="text-[10px] text-[#14b8a6] font-medium mb-1">{item.category}</span>
                    <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#14b8a6] transition-colors mb-3">{item.title}</h3>
                    
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                      <span className="text-xs font-semibold text-white/90">{item.price}</span>
                      
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
                        className="p-2 rounded-xl bg-[#14b8a6]/10 hover:bg-[#14b8a6] text-[#14b8a6] hover:text-black transition-colors"
                        title="افزودن به سبد خرید"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </Container>
      </section>

      {/* پرفروش‌ترین‌ها */}
      <section className="py-12 mb-12">
        <Container>
          <motion.div 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={smoothTransition}
          >
            <h2 className="text-3xl font-bold text-white mb-8">پرفروش‌ترین‌ها</h2>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial={shouldReduceMotion ? false : "initial"}
            whileInView={shouldReduceMotion ? undefined : "animate"}
            viewport={viewportConfig}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {[
              { id: "best-1", title: "پلتفرم X-UI Core ابری", price: "اشتراکی", category: "شبکه و سرور" },
              { id: "best-2", title: "پایه اسپیکر رومیزی لیزرکات", price: "۲,۱۰۰,۰۰۰ تومان", category: "طراحی اختصاصی" },
              { id: "best-3", title: "ماگ مسافرتی هوشمند", price: "۱,۲۰۰,۰۰۰ تومان", category: "لوازم جانبی" },
              { id: "best-4", title: "نورپردازی استودیو RGB", price: "۳,۵۰۰,۰۰۰ تومان", category: "تجهیزات استریم" },
            ].map((item, idx) => {
              // 👈 بررسی اینکه آیا محصول لایک شده است یا خیر
              const liked = isInWishlist(item.id);

              return (
                <motion.div key={idx} variants={fadeInUp} className="w-[200px] sm:w-[220px] md:w-auto shrink-0 snap-center">
                  <Link href={`/products/${item.id}`} className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex flex-col hover:border-[#14b8a6]/40 hover:bg-white/[0.04] transition-all h-full">
                    
                    {/* 👈 دکمه قلب متصل به کانتکست با استایل قرمز رنگ مشابه ProductCard */}
                    <button 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        e.stopPropagation(); 
                        toggleItem(item.id);
                      }} 
                      className="absolute top-5 left-5 z-10 p-2 rounded-full bg-black/40 backdrop-blur-sm transition-all hover:scale-110"
                      title={liked ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                    >
                      <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-white/70 hover:text-white'}`} />
                    </button>

                    <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-white/5 mb-3 flex items-center justify-center text-xs text-white/30">
                      تصویر محصول
                    </div>

                    <span className="text-[10px] text-[#14b8a6] font-medium mb-1">{item.category}</span>
                    <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#14b8a6] transition-colors mb-3">{item.title}</h3>
                    
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                      <span className="text-xs font-semibold text-white/90">{item.price}</span>
                      
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
                        className="p-2 rounded-xl bg-[#14b8a6]/10 hover:bg-[#14b8a6] text-[#14b8a6] hover:text-black transition-colors"
                        title="افزودن به سبد خرید"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </Container>
      </section>

      {/* بازدیدهای اخیر شما */}
      {recentItems.length > 0 && (
        <section className="py-12 mb-12">
          <Container>
            <motion.div 
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={smoothTransition}
              className="flex items-center justify-between mb-12"
            >
              <h2 className="text-3xl font-bold text-white">بازدیدهای اخیر شما</h2>
            </motion.div>
            
            <motion.div 
              variants={staggerContainer}
              initial={shouldReduceMotion ? false : "initial"}
              whileInView={shouldReduceMotion ? undefined : "animate"}
              viewport={viewportConfig}
              className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-6 md:gap-4 md:overflow-visible md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {recentItems.map((product, index) => (
                <motion.div key={index} variants={fadeInUp} className="w-[140px] md:w-auto shrink-0 snap-center">
                  <Link href={`/products/${product.id}`} className="group bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex flex-col hover:border-[#14b8a6]/40 hover:shadow-[0_0_20px_rgba(20,184,166,0.1)] transition-all h-full">
                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-white/5 mb-3">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <h3 className="text-xs font-bold text-[rgb(var(--text-primary))] line-clamp-1 mb-1">{product.title}</h3>
                    <p className="text-[10px] text-[rgb(var(--primary))]">{product.price}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>
      )}

      {/* خبرنامه */}
      <motion.section 
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={viewportConfig}
        transition={smoothTransition}
        className="border-t border-white/5 bg-white/[0.02] py-24 mt-auto"
      >
        <Container className="max-w-3xl text-center">
          <h3 className="text-2xl font-bold text-white mb-4">به خبرنامه AliNavigator بپیوندید</h3>
          <p className="text-white/60 mb-8">از جدیدترین محصولات، تخفیف‌ها و پروژه‌های آموزشی ما جا نمانید.</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="آدرس ایمیل شما" 
              className="flex-1 h-12 px-4 rounded-lg bg-black/50 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#14b8a6] transition-colors dir-ltr"
            />
            <motion.div whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}>
              <Button size="lg" className="h-12 px-8 w-full sm:w-auto transition-all duration-300 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                اشتراک
              </Button>
            </motion.div>
          </div>
          <p className="text-xs text-white/40 mt-4">تا به امروز ۱۰۹۵ سفارش موفق ثبت شده است.</p>
        </Container>
      </motion.section>
    </div>
  );
}