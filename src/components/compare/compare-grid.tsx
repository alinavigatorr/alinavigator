// src/components/compare/compare-grid.tsx

import React from 'react';
import SpecRow from './spec-row';

interface Product {
  id: string;
}

interface SpecAttribute {
  attributeName: string;
  status: string; // 'EQUAL' | 'DIFFERENT' | 'MISSING'
  values: Record<string, any>;
}

interface SpecGroup {
  groupName: string;
  attributes: SpecAttribute[];
}

interface CompareGridProps {
  products: Product[];
  groups: SpecGroup[];
}

export default function CompareGrid({ products, groups }: CompareGridProps) {
  return (
    <div className="flex flex-col w-full pb-8">
      {groups.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className="flex flex-col w-full">
          {/* هدر گروه مشخصات (مثلاً Core Components) */}
          <div className="w-full bg-white/[0.03] border-b border-t border-white/5 px-4 sm:px-6 py-3 sm:py-4 first:border-t-0">
            <h4 className="text-white/60 font-semibold text-xs sm:text-sm uppercase tracking-widest">
              {group.groupName}
            </h4>
          </div>

          {/* ردیف‌های ویژگی‌های این گروه */}
          <div className="flex flex-col w-full">
            {group.attributes.map((attribute, attrIndex) => (
               // @ts-ignore
              <SpecRow 
                key={`attr-${attrIndex}`} 
                attribute={attribute} 
                products={products} 
                isLast={attrIndex === group.attributes.length - 1} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}