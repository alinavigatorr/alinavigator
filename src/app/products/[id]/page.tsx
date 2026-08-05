import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { Container } from '../../../components/ui/container';
import { ProductCard } from '../../../components/ui/product-card';
import { productService } from '../../../services/productService';
import { ProductGallery, ProductActions, ProductSpecs } from './components';

// بارگذاری پویا برای بخش‌های سنگین‌تر جهت کاهش حجم اولیه JS
const ReviewSection = dynamic(() => import('../../../components/reviews/MountedReviewSection'), {
  loading: () => <div className="h-64 w-full animate-pulse bg-white/5 rounded-3xl mt-16" />,
  ssr: false
});

const QnASection = dynamic(() => import('../../../components/qna/qna-section'), {
  loading: () => <div className="h-32 w-full animate-pulse bg-white/5 rounded-3xl mt-8" />,
  ssr: false
});

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

// 🌟 فاز ۶: سئوی پیشرفته و متادیتای کامل برای موتورهای جستجو و شبکه‌های اجتماعی
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await productService.getProductById(resolvedParams.id);
  
  if (!product) {
    return { title: 'محصول یافت نشد - AliNavigator' };
  }

  const productUrl = `https://alinavigator.com/products/${product.id}`;
  const productImage = product.image || 'https://alinavigator.com/og-image.jpg';

  return {
    title: `${product.title} - AliNavigator`,
    description: product.description || `خرید ${product.title} با بهترین قیمت از فروشگاه آلی‌نویگیتور.`,
    alternates: {
      canonical: productUrl,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    openGraph: {
      title: product.title,
      description: product.description,
      url: productUrl,
      type: 'website',
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: [productImage],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  // دریافت ایمن متغیر id برای سازگاری کامل با Next.js
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  const product = await productService.getProductById(productId);
  
  if (!product) notFound();

  const relatedProducts = await productService.getRelatedProducts(product.category, 4);

  // 🌟 فاز ۶: تولید Structured Data (JSON-LD) برای تایید ساختار محصول در گوگل
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image,
    sku: product.id,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'IRR', // یا تمایل به استفاده از واحد ارزی استاندارد
      price: product.price || '0',
      availability: 'https://schema.org/InStock',
      url: `https://alinavigator.com/products/${product.id}`,
    },
  };

  return (
    <div className="flex flex-col min-h-screen pt-32 pb-32 md:pb-24">
      {/* تزریق کدهای ساختاریافته سئو */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <Container>
        {/* Breadcrumb - رندر سریع سمت سرور */}
        <nav className="flex items-center gap-2.5 text-xs font-medium text-white/40 mb-10 tracking-wide" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white transition-colors cursor-pointer">خانه</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors cursor-pointer">محصولات</Link>
          <span>/</span>
          <span className="text-[rgb(var(--primary))]">{product.title}</span>
        </nav>

        {/* بخش اصلی محصول (گالری و دکمه‌های خرید - رندر فوری برای LCP) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 mb-20">
          <div className="w-full">
            <ProductGallery />
          </div>

          <div className="flex flex-col">
            <div className="inline-flex px-3.5 py-1.5 rounded-full bg-[rgb(var(--success))]/10 border border-[rgb(var(--success))]/20 text-[rgb(var(--success))] text-xs font-bold w-fit mb-6 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              {product.badge || 'موجود در انبار'}
            </div>
            
            <h1 className="text-3xl md:text-[2.5rem] font-extrabold text-[rgb(var(--text-primary))] tracking-tight leading-[1.2] mb-6">
              {product.title}
            </h1>
            
            <div className="flex items-baseline gap-1.5 mb-8">
              <span className="text-3xl font-black text-[rgb(var(--primary))] drop-shadow-[0_0_10px_rgba(20,184,166,0.2)]">{product.formattedPrice}</span>
              <span className="text-sm font-medium text-white/40">تومان</span>
            </div>

            <ProductActions price={product.formattedPrice} />
            <ProductSpecs description={product.description} />
          </div>
        </div>

        {/* بخش تعاملی نظرات و پرسش‌وپاسخ با مرزهای Suspense */}
        <div className="mb-24 space-y-12">
          <Suspense fallback={<div className="h-64 w-full animate-pulse bg-white/5 rounded-3xl" />}>
            <ReviewSection productId={product.id} />
          </Suspense>

          <Suspense fallback={<div className="h-32 w-full animate-pulse bg-white/5 rounded-3xl" />}>
            <QnASection />
          </Suspense>
        </div>

        {/* محصولات مشابه */}
        <div className="pt-16 border-t border-white/5 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-[rgb(var(--primary))]/50 to-transparent"></div>
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[rgb(var(--text-primary))] tracking-tight">محصولات مشابه</h2>
            <Link href="/products" className="text-sm font-medium text-[rgb(var(--primary))] hover:text-white transition-colors">مشاهده همه</Link>
          </div>
          
          <Suspense fallback={<div className="h-48 w-full animate-pulse bg-white/5 rounded-2xl" />}>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {relatedProducts.map((p) => (
                <div key={p.id} className="w-[200px] sm:w-[240px] shrink-0 snap-center h-full">
                  <ProductCard
                    id={p.id}
                    title={p.title}
                    price={p.formattedPrice}
                    category={p.category}
                    rating={p.rating}
                    badge={p.badge}
                  />
                </div>
              ))}
            </div>
          </Suspense>
        </div>
      </Container>
    </div>
  );
}