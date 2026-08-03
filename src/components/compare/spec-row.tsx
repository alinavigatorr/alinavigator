// src/components/compare/spec-row.tsx

import React from 'react';

interface Product {
  id: string;
}

interface SpecAttribute {
  attributeName: string;
  status: string; // 'EQUAL' | 'DIFFERENT' | 'MISSING'
  values: Record<string, any>;
}

interface SpecRowProps {
  attribute: SpecAttribute;
  products: Product[];
  isLast?: boolean;
}

export default function SpecRow({ attribute, products, isLast }: SpecRowProps) {
  const isEqual = attribute.status === 'EQUAL';

  return (
    <div className={`flex w-full hover:bg-white/[0.02] transition-colors ${!isLast ? 'border-b border-white/5' : ''}`}>
      {/* ستون نام ویژگی */}
      <div className="w-40 sm:w-48 lg:w-56 flex-shrink-0 p-4 sm:p-6 border-l border-white/5 flex items-center justify-start">
        <span className={`text-xs sm:text-sm font-medium ${isEqual ? 'text-[#00FF66]' : 'text-white/80'}`}>
          {attribute.attributeName}
        </span>
      </div>

      {/* ستون مقادیر برای هر محصول */}
      <div className="flex-1 flex">
        {products.map((product, index) => {
          const value = attribute.values[product.id];
          const isMissing = value === null || value === undefined;

          return (
            <div
              key={`${product.id}-${attribute.attributeName}`}
              className={`flex-1 p-4 sm:p-6 flex items-center justify-center text-center ${
                index !== products.length - 1 ? 'border-l border-white/5' : ''
              }`}
            >
              {isMissing ? (
                <span className="text-white/20 text-xs sm:text-sm font-medium">-</span>
              ) : (
                <span className={`text-xs sm:text-sm ${isEqual ? 'text-[#00FF66]/90' : 'text-white/90'}`}>
                  {value}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}