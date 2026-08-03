// src/services/comparison/spec-comparator.ts

import { ComparisonProduct, SpecGroupComparison, SpecAttributeComparison, SpecComparisonStatus } from './comparison-types';
import { SpecNormalizer } from './spec-normalizer';

export class SpecComparator {
  /**
   * مقایسه دقیق و استخراج وضعیت تفاوت/شباهت مشخصات بین محصولات
   */
  public static compare(products: ComparisonProduct[]): SpecGroupComparison[] {
    const masterSchema = SpecNormalizer.extractMasterSchema(products);
    const groups: SpecGroupComparison[] = [];

    // پیمایش روی تمام گروه‌ها و ویژگی‌های استخراج شده
    for (const [groupName, attributesSet] of masterSchema.entries()) {
      const attributes: SpecAttributeComparison[] = [];

      for (const attributeName of attributesSet) {
        const values: Record<string, string | number | boolean | null> = {};
        let isMissing = false;
        
        // استخراج مقدار این ویژگی برای تمامی محصولات موجود
        for (const product of products) {
          const value = product.specs?.[groupName]?.[attributeName];
          if (value === undefined || value === null) {
            isMissing = true;
            values[product.id] = null;
          } else {
            values[product.id] = value;
          }
        }

        // محاسبه وضعیت (Status) ویژگی
        let status: SpecComparisonStatus = 'MISSING';

        if (!isMissing) {
          // استخراج تمام مقادیر غیر null
          const extractedValues = Object.values(values);
          const firstValue = extractedValues[0];
          // بررسی اینکه آیا تمام محصولات مقدار کاملاً یکسانی برای این ویژگی دارند یا خیر
          const allEqual = extractedValues.every(val => val === firstValue);
          
          status = allEqual ? 'EQUAL' : 'DIFFERENT';
        }

        attributes.push({
          attributeName,
          values,
          status,
        });
      }

      groups.push({
        groupName,
        attributes,
      });
    }

    return groups;
  }
}