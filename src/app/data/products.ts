export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  rating: number;
  specs?: Record<string, string>;
}

// تمام محصولات سایت شما در اینجا ثبت می‌شوند تا هم در مقایسه، هم در ویش‌لیست و هم در صفحه اصلی شناخته شوند
export const allProducts: Product[] = [
  { id: 'p1', title: 'کیبورد مکانیکال AliNavigatorr', price: 4500000, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=60', rating: 4.8 },
  { id: 'p2', title: 'کیبورد ریزر بلک‌ویدو V3', price: 5200000, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&q=60', rating: 4.5 },
  { id: 'p3', title: 'کیبورد لاجیتک MX Mechanical', price: 6800000, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&q=60', rating: 4.9 },
  { id: 'p4', title: 'کیبورد کورسیر K70', price: 8100000, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=300&q=60', rating: 4.7 },
  { id: 'p5', title: 'کیبورد کیکرون K2', price: 3900000, image: 'https://images.unsplash.com/photo-1605335153282-5ce960d70eb0?w=300&q=60', rating: 4.6 },
];

export function getProductById(id: string) {
  return allProducts.find(p => p.id === id);
}