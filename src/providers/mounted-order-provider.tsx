import React, { createContext, useContext, useMemo } from 'react';

// 1. Import real database implementations instead of the Mock ones
import { PrismaOrderRepository } from '../database/prisma/repositories/prisma-order-repository';
import { PrismaOrderItemRepository } from '../database/prisma/repositories/prisma-order-item-repository';
import { PrismaOrderDataSource } from '../services/orders/prisma-order-data-source';

// 2. Import the unchanging Business Service
import { OrderService } from '../services/orders/order-service';

// Context definition (Unchanged)
interface OrderContextType {
  orderService: OrderService;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const MountedOrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 3. Dependency Injection Wiring (Singleton instance per app lifecycle)
  const orderService = useMemo(() => {
    // Step A: Instantiate Repositories
    const orderRepository = new PrismaOrderRepository();
    const orderItemRepository = new PrismaOrderItemRepository();

    // Step B: Inject Repositories into the Real Data Source
    // This used to be: new MockOrderDataSource()
    const orderDataSource = new PrismaOrderDataSource(orderRepository, orderItemRepository);

    // Step C: Inject Data Source into the Business Service
    return new OrderService(orderDataSource);
  }, []);

  return (
    <OrderContext.Provider value={{ orderService }}>
      {children}
    </OrderContext.Provider>
  );
};

// Hook for UI components (Unchanged)
export const useOrderEngine = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderEngine must be used within a MountedOrderProvider');
  }
  return context.orderService;
};