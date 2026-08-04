import { Product } from '../types/product';

export const mockProducts: Product[] = [
  { id: '1', title: 'کیبورد مکانیکال Keychron K8 Pro', brand: 'Keychron', category: 'Accessories', price: 4500000, discountPrice: 4200000, rating: 4.8, reviewsCount: 124, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80', inStock: true, createdAt: '2023-10-01' },
  { id: '2', title: 'ماوس وایرلس Logitech MX Master 3S', brand: 'Logitech', category: 'Accessories', price: 5200000, rating: 4.9, reviewsCount: 342, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80', inStock: true, createdAt: '2023-09-15' },
  { id: '3', title: 'مانیتور استودیو Apple Studio Display', brand: 'Apple', category: 'Monitors', price: 85000000, rating: 4.9, reviewsCount: 89, image: 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=800&q=80', inStock: false, createdAt: '2023-11-20' },
  { id: '4', title: 'هدفون Sony WH-1000XM5', brand: 'Sony', category: 'Audio', price: 18500000, discountPrice: 17000000, rating: 4.7, reviewsCount: 450, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80', inStock: true, createdAt: '2023-08-10' },
  { id: '5', title: 'لپ‌تاپ MacBook Pro M3 Max 16"', brand: 'Apple', category: 'Laptops', price: 185000000, rating: 5.0, reviewsCount: 45, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', inStock: true, createdAt: '2023-12-05' },
  { id: '6', title: 'میکروفون Shure SM7B', brand: 'Shure', category: 'Audio', price: 22000000, rating: 4.9, reviewsCount: 890, image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80', inStock: true, createdAt: '2023-05-12' },
];