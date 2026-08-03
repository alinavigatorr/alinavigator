// src/components/compare/compare-layout.tsx

import React from 'react';
import CompareHeader from './compare-header';
import CompareGrid from './compare-grid';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

interface SpecAttribute {
  attributeName: string;
  status: string;
  values: Record<string, any>;
}

interface SpecGroup {
  groupName: string;
  attributes: SpecAttribute[];
}

interface CompareLayoutProps {
  products: Product[];
  groups: SpecGroup[];
}

export default function CompareLayout({ products, groups }: CompareLayoutProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="relative w-full rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
      {/* 
        Container for horizontal scroll on mobile/tablet. 
        min-w-[800px] ensures the layout doesn't break on small screens, forcing a scroll instead.
      */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] lg:min-w-full flex flex-col">
          {/* @ts-ignore */}
          <CompareHeader products={products} />
          
          <div className="h-[1px] w-full bg-white/10"></div>
          
          {/* @ts-ignore */}
          <CompareGrid products={products} groups={groups} />
        </div>
      </div>
    </div>
  );
}