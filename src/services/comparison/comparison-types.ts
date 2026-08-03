// src/services/comparison/comparison-types.ts

export interface ComparisonProduct {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  // ساختار مشخصات: گروه -> ویژگی -> مقدار
  // مثال: { "Display": { "Resolution": "4K", "Size": "32 inch" } }
  specs: Record<string, Record<string, string | number | boolean>>; 
}

export type SpecComparisonStatus = 'EQUAL' | 'DIFFERENT' | 'MISSING';

export interface SpecAttributeComparison {
  attributeName: string;
  // مقادیر هر محصول برای این ویژگی با کلید productId
  values: Record<string, string | number | boolean | null>; 
  status: SpecComparisonStatus;
}

export interface SpecGroupComparison {
  groupName: string;
  attributes: SpecAttributeComparison[];
}

export interface ComparisonResult {
  isEligible: boolean;
  reason?: string;
  productIds: string[];
  groups: SpecGroupComparison[];
}

export interface ComparisonPolicyConfig {
  maxProducts: number;
  requireSameCategory: boolean;
}