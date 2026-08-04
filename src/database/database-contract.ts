export interface DatabaseHealth {
    isHealthy: boolean;
    latencyMs: number;
    message?: string;
  }
  
  export interface DatabaseConnection {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    healthCheck(): Promise<DatabaseHealth>;
  }
  
  export interface DatabaseProvider<TClient = unknown> {
    getClient(): TClient;
    connection: DatabaseConnection;
  }