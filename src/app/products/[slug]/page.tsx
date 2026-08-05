import React, { Suspense } from 'react';
import ProductDetails from '@/components/product/ProductDetails';
import ReviewsSection from '@/components/product/ReviewsSection';
import RelatedProducts from '@/components/product/RelatedProducts';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  // گرفتن اطلاعات اصلی محصول که برای سئو و نمایش اولیه حیاتی است
  const productData = await fetchProduct(params.slug);

  return (
    <div className="container mx-auto">
      {/* بخش اصلی فوراً رندر می‌شود */}
      <ProductDetails data={productData} />

      {/* بخش نظرات در بک‌گراند استریم می‌شود و صفحه را قفل نمی‌کند */}
      <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100 rounded">در حال دریافت نظرات کاربران...</div>}>
        <ReviewsSection productId={productData.id} />
      </Suspense>

      {/* محصولات مرتبط به صورت موازی لود می‌شوند */}
      <Suspense fallback={<div className="h-64 flex space-x-4"><div className="w-1/4 animate-pulse bg-gray-100"></div></div>}>
        <RelatedProducts categoryId={productData.categoryId} />
      </Suspense>
    </div>
  );
}