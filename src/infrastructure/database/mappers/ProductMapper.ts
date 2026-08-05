// Assuming Prisma models and Domain models are imported here
// import { Product as PrismaProduct } from '@prisma/client';
// import { Product as DomainProduct } from '../../../domain/product/entities';

export class ProductMapper {
    public static toDomain(prismaEntity: any): any /* DomainProduct */ {
      return {
        id: prismaEntity.id,
        title: prismaEntity.title,
        price: prismaEntity.price,
        stock: prismaEntity.stock,
        isActive: prismaEntity.isActive,
        // Map JSON or nested relations cleanly
        attributes: prismaEntity.metadata ? JSON.parse(prismaEntity.metadata) : {},
        createdAt: prismaEntity.createdAt,
      };
    }
  
    public static toPrismaCreate(domainEntity: any): any /* Prisma.ProductCreateInput */ {
      return {
        id: domainEntity.id,
        title: domainEntity.title,
        price: domainEntity.price,
        stock: domainEntity.stock,
        isActive: domainEntity.isActive,
        metadata: JSON.stringify(domainEntity.attributes || {})
      };
    }
  }