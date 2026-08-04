import { Order, Prisma, OrderStatus } from '@prisma/client';
import { prisma } from '../prisma-client';
import { PrismaBaseRepository } from '../prisma-base-repository';
import { OrderRepository } from '../../repositories/order-repository';

/**
 * Prisma implementation of the OrderRepository.
 * Inherits generic CRUD operations from PrismaBaseRepository.
 */
export class PrismaOrderRepository 
  extends PrismaBaseRepository<Order, Prisma.OrderCreateInput, Prisma.OrderUpdateInput> 
  implements OrderRepository<Order, Prisma.OrderCreateInput, Prisma.OrderUpdateInput> 
{
  constructor() {
    // Pass the specific Prisma delegate (prisma.order) to the base repository
    super(prisma.order);
  }

  async findByCustomer(customerId: string): Promise<Order[]> {
    return prisma.order.findMany({
      where: { userId: customerId },
    });
  }

  async findBySeller(sellerId: string): Promise<Order[]> {
    // Finds all orders that contain at least one item belonging to the given seller
    return prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId: sellerId,
            },
          },
        },
      },
    });
  }

  async findByStatus(status: string): Promise<Order[]> {
    return prisma.order.findMany({
      // Cast the string status to Prisma's OrderStatus Enum
      where: { status: status as OrderStatus },
    });
  }
}