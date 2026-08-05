import { IEmbeddingProvider } from '../../../../domain/search/vector/contracts/IVectorProviders';
import { VectorDocument, VectorMetadata } from '../../../../domain/search/vector/entities/VectorDomain';

export abstract class EntityEmbedder<T> {
  constructor(protected readonly embeddingProvider: IEmbeddingProvider) {}
  
  abstract extractTextRepresentation(entity: T): string;
  abstract extractMetadata(entity: T): VectorMetadata;

  public async embed(entity: T): Promise<VectorDocument> {
    const text = this.extractTextRepresentation(entity);
    const embedding = await this.embeddingProvider.generate(text);
    const metadata = this.extractMetadata(entity);

    return {
      id: `vec_${metadata.entityType}_${metadata.entityId}`,
      embedding,
      metadata,
      originalContentReference: text
    };
  }
}

// Example Implementations representing independent pipelines
export class ProductEmbedder extends EntityEmbedder<any> {
  extractTextRepresentation(product: any): string {
    return `${product.brand || ''} ${product.title} ${product.category}. ${product.description}`;
  }
  extractMetadata(product: any): VectorMetadata {
    return {
      entityId: product.id,
      entityType: 'PRODUCT',
      tags: product.tags || [],
      attributes: { price: product.price, inStock: product.stock > 0 },
      timestamp: new Date()
    };
  }
}

export class CategoryEmbedder extends EntityEmbedder<any> {
  extractTextRepresentation(category: any): string {
    return `${category.name}: ${category.description}`;
  }
  extractMetadata(category: any): VectorMetadata {
    return {
      entityId: category.id,
      entityType: 'CATEGORY',
      tags: [],
      attributes: { parentId: category.parentId },
      timestamp: new Date()
    };
  }
}