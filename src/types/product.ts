export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  inStock: boolean;
  createdAt: string;
}