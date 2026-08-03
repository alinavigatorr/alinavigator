export interface CartItem {
  id: string; 
  productId: string; 
  title: string;
  price: number;
  formattedPrice: string;
  category: string;
  image?: string;
  quantity: number;
  color?: string; 
  warranty?: string; 
  stock?: number; // 🌟 فیلد موجودی انبار اضافه شد
}

export interface CartContextType {
  items: CartItem[];
  savedItems: CartItem[];
  isMounted: boolean;
  totalItems: number;
  subtotal: number;
  formattedSubtotal: string;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  itemExists: (id: string) => boolean;
  isCartOpen: boolean;
  toggleCart: () => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeSavedItem: (id: string) => void;
}