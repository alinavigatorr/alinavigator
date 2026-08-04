import React, { createContext, useContext, useMemo } from 'react';

// 1. Import real database implementations instead of the Mock ones
import { PrismaWalletRepository } from '../database/prisma/repositories/prisma-wallet-repository';
import { PrismaWalletTransactionRepository } from '../database/prisma/repositories/prisma-wallet-transaction-repository';
import { PrismaWalletDataSource } from '../services/wallet/prisma-wallet-data-source';

// 2. Import the unchanging Business Service
import { WalletService } from '../services/wallet/wallet-service';

// Context definition (Unchanged)
interface WalletContextType {
  walletService: WalletService;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const MountedWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 3. Dependency Injection Wiring (Singleton instance per app lifecycle)
  const walletService = useMemo(() => {
    // Step A: Instantiate Repositories
    const walletRepository = new PrismaWalletRepository();
    const transactionRepository = new PrismaWalletTransactionRepository();

    // Step B: Inject Repositories into the Real Data Source
    // This used to be: new MockWalletDataSource()
    const walletDataSource = new PrismaWalletDataSource(walletRepository, transactionRepository);

    // Step C: Inject Data Source into the Business Service
    return new WalletService(walletDataSource);
  }, []);

  return (
    <WalletContext.Provider value={{ walletService }}>
      {children}
    </WalletContext.Provider>
  );
};

// Hook for UI components (Unchanged)
export const useWalletEngine = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletEngine must be used within a MountedWalletProvider');
  }
  return context.walletService;
};