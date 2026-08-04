'use client';

import React from 'react';
import { ProductCard } from '../ui/product-card';

// لیست نمونه دیتابیس با IDهای کاملاً انحصاری
const sampleProducts = [
  { id: 'p1', title: 'فرمان بازی لاجیتک G923 TrueForce', price: '۱۸,۵۰۰,۰۰۰', category: 'شبیه‌ساز رانندگی', rating: 4.8 },
  { id: 'p2', title: 'میکروفون داینامیک Shure MV7X', price: '۱۱,۲۰۰,۰۰۰', category: 'تجهیزات استودیو', rating: 5.0 },
  { id: 'p3', title: 'استند فلزی کاستوم مگ‌سیف (رنگ مشکی مات)', price: '۱,۴۵۰,۰۰۰', category: 'طراحی اختصاصی', rating: 4.9 },
  { id: 'p4', title: 'کیت تعمیر و تمیزکننده موتور هاب اسکوتر', price: '۸۵۰,۰۰۰', category: 'قطعات موتور', rating: 4.5 },
  { id: 'p5', title: 'پلتفرم X-UI Core ابری', price: 'اشتراکی', category: 'شبکه و سرور', rating: 4.9 },
  { id: 'p6', title: 'پایه اسپیکر رومیزی لیزرکات', price: '۲,۱۰۰,۰۰۰', category: 'طراحی اختصاصی', rating: 4.7 }
];

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sampleProducts.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          price={product.price}
          category={product.category}
          rating={product.rating}
        />
      ))}
    </div>
  );
}