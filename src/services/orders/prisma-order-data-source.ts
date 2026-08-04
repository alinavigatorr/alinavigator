import { OrderDataSource } from './order-data-source';
import { PrismaOrderRepository } from '../../database/prisma/repositories/prisma-order-repository';
import { PrismaOrderItemRepository } from '../../database/prisma/repositories/prisma-order-item-repository';
import { 
  OrderDTO, 
  CreateOrderDTO, 
  UpdateOrderStatusDTO 
} from './dto/order.dto';

/**
 * Real Database implementation of OrderDataSource using Prisma Repositories.
 */
export class PrismaOrderDataSource implements OrderDataSource {
  
  constructor(
    private readonly orderRepository: PrismaOrderRepository,
    private readonly orderItemRepository: PrismaOrderItemRepository
  ) {}

  async getOrders(): Promise<OrderDTO[]> {
    const orders = await this.orderRepository.findMany({
      orderBy: 'createdAt',
      sortOrder: 'desc',
    });

    return orders.map(order => this.mapToOrderDTO(order));
  }

  async getOrder(id: string): Promise<OrderDTO | null> {
    const order = await this.orderRepository.findById(id);
    if (!order) return null;

    return this.mapToOrderDTO(order);
  }

  async createOrder(data: CreateOrderDTO): Promise<OrderDTO> {
    // Note: In a production app, order creation with items should be transactional.
    // Here we pass the structured input to the Prisma repository creation layer.
    const createdOrder = await this.orderRepository.create({
      userId: data.customerId,
      status: 'PENDING',
      totalAmount: data.totalAmount,
      shippingAddress: data.shippingAddress,
      // If items are structured for nested creation in Prisma:
      items: {
        create: data.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    } as any);

    return this.mapToOrderDTO(createdOrder);
  }

  async cancelOrder(id: string): Promise<OrderDTO> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error('Order not found.');
    }

    if (order.status !== 'PENDING') {
      throw new Error('Only pending orders can be cancelled.');
    }

    const updatedOrder = await this.orderRepository.update(id, {
      status: 'CANCELLED',
    } as any);

    return this.mapToOrderDTO(updatedOrder);
  }

  async updateOrderStatus(id: string, data: UpdateOrderStatusDTO): Promise<OrderDTO> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error('Order not found.');
    }

    const updatedOrder = await this.orderRepository.update(id, {
      status: data.status,
    } as any);

    return this.mapToOrderDTO(updatedOrder);
  }

  async getCustomerOrders(customerId: string): Promise<OrderDTO[]> {
    const orders = await this.orderRepository.findByCustomer(customerId);
    return orders.map(order => this.mapToOrderDTO(order));
  }

  async getSellerOrders(sellerId: string): Promise<OrderDTO[]> {
    const orders = await this.orderRepository.findBySeller(sellerId);
    return orders.map(order => this.mapToOrderDTO(order));
  }

  /**
   * Helper mapper to convert Prisma Order entity to OrderDTO
   */
  private mapToOrderDTO(order: any): OrderDTO {
    return {
      id: order.id,
      customerId: order.userId,
      status: order.status,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      items: order.items ? order.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })) : [],
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}