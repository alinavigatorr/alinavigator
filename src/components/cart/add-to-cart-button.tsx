'use client';

import React from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';

interface AddToCartButtonProps {
  product: {
    id: string;
    title: string;
    price: number;
    formattedPrice: string;
    category: string;
    image?: string;
  };
  className?: string;
  showText?: boolean;
}

export function AddToCartButton({ product, className = "", showText = false }: AddToCartButtonProps) {
  const { addItem, itemExists, isMounted } = useCart();
  const exists = isMounted ? itemExists(product.id) : false;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleAdd}
      aria-label="افزودن به سبد خرید"
      className={`relative flex items-center justify-center gap-2 overflow-hidden transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] ${
        exists 
          ? 'bg-[#14b8a6] text-black' 
          : 'bg-[#14b8a6]/10 text-[#14b8a6] hover:bg-[#14b8a6] hover:text-black'
      } ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={exists ? 'check' : 'bag'}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {exists ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
        </motion.div>
      </AnimatePresence>
      {showText && <span className="text-sm font-bold">{exists ? 'موجود در سبد' : 'افزودن به سبد'}</span>}
    </motion.button>
  );
}