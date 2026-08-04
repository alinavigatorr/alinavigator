/**
 * Abstraction for database transactions and Unit of Work pattern.
 */
export interface TransactionScope {
    commit(): Promise<void>;
    rollback(): Promise<void>;
    isActive(): boolean;
  }
  
  export interface TransactionManager {
    /**
     * Executes a callback function within an atomic transaction block.
     * Automatically commits on success or rolls back on error.
     */
    runInTransaction<T>(work: (transaction: TransactionScope) => Promise<T>): Promise<T>;
  
    /**
     * Manually starts a new transaction scope.
     */
    beginTransaction(): Promise<TransactionScope>;
  }