// src/services/comparison/spec-normalizer.ts

import { ComparisonProduct } from './comparison-types';

export class SpecNormalizer {
  /**
   * استخراج شمای جامع شامل تمام گروه‌ها و ویژگی‌های منحصربه‌فرد از لیست محصولات
   * برمی‌گرداند: Map<GroupName, Set<AttributeName>>
   */
  public static extractMasterSchema(products: ComparisonProduct[]): Map<string, Set<string>> {
    const schema = new Map<string, Set<string>>();

    for (const product of products) {
      if (!product.specs) {
        continue;
      }

      for (const [groupName, attributes] of Object.entries(product.specs)) {
        if (!schema.has(groupName)) {
          schema.set(groupName, new Set<string>());
        }
        
        const groupSet = schema.get(groupName)!;
        
        for (const attributeName of Object.keys(attributes)) {
          groupSet.add(attributeName);
        }
      }
    }

    return schema;
  }
}