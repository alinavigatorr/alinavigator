import { notFound } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Container } from '../../../components/ui/container';
import { ProductCard } from '../../../components/ui/product-card';
import { productService } from '../../../services/productService';
import { ProductGallery, ProductActions, ProductSpecs } from './components';

// تغییر مسیر به کامپوننت جدید MountedReviewSection
const ReviewSection = dynamic(() => import('../../../components/reviews/MountedReviewSection'), {
  loading: () => <div className="h-64 w-full animate-pulse bg-white/5 rounded-3xl mt-16" />,
  ssr: false
});

const QnASection = dynamic(() => import('../../../components/qna/qna-section'), {
  loading: () => <div className="h-32 w-full animate-pulse bg-white/5 rounded-3xl mt-8" />,
  ssr: false
});

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps) {
  const product = await productService.getProductById(params.id);
  if (!product) return { title: 'محصول یافت نشد - AliNavigator' };
  return { title: `${product.title} - AliNavigator` };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await productService.getProductById(params.id);
  
  if (!product) notFound();

  const relatedProducts = await productService.getRelatedProducts(product.category, 4);

  return (
    <div className="flex flex-col min-h-screen pt-32 pb-32 md:pb-24">
      <Container>
        <nav className="flex items-center gap-2.5 text-xs font-medium text-white/40 mb-10 tracking-wide">
          <Link href="/" className="hover:text-white transition-colors cursor-pointer">خانه</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors cursor-pointer">محصولات</Link>
          <span>/</span>
          <span className="text-[rgb(var(--primary))]">{product.title}</span>
        </nav>

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

        <div className="mb-24 space-y-12">
          {/* ارسال productId به کامپوننت نظرات */}
          <ReviewSection productId={product.id} />
          <QnASection />
        </div>

        <div className="pt-16 border-t border-white/5 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-[rgb(var(--primary))]/50 to-transparent"></div>
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[rgb(var(--text-primary))] tracking-tight">محصولات مشابه</h2>
            <button className="text-sm font-medium text-[rgb(var(--primary))] hover:text-white transition-colors">مشاهده همه</button>
          </div>
          
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
        </div>
      </Container>
    </div>
  );
}