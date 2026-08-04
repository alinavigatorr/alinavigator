/**
 * Enterprise Application Metrics Collector.
 * Prepares counters and gauges for Requests, Errors, DB Queries, and Core Modules.
 * Designed to easily hook into Prometheus, OpenTelemetry, or custom monitoring dashboards.
 */
export class MetricsCollector {
    private static metrics = {
      requestsTotal: 0,
      errorsTotal: 0,
      dbQueriesTotal: 0,
      authEventsTotal: 0,
      ordersTotal: 0,
      walletOperationsTotal: 0,
    };
  
    static incrementRequests(): void {
      this.metrics.requestsTotal++;
    }
  
    static incrementErrors(): void {
      this.metrics.errorsTotal++;
    }
  
    static incrementDbQueries(): void {
      this.metrics.dbQueriesTotal++;
    }
  
    static incrementAuthEvents(): void {
      this.metrics.authEventsTotal++;
    }
  
    static incrementOrders(): void {
      this.metrics.ordersTotal++;
    }
  
    static incrementWalletOperations(): void {
      this.metrics.walletOperationsTotal++;
    }
  
    static getMetrics(): {
      requestsTotal: number;
      errorsTotal: number;
      dbQueriesTotal: number;
      authEventsTotal: number;
      ordersTotal: number;
      walletOperationsTotal: number;
      timestamp: string;
    } {
      return {
        ...this.metrics,
        timestamp: new Date().toISOString(),
      };
    }
  
    static reset(): void {
      this.metrics = {
        requestsTotal: 0,
        errorsTotal: 0,
        dbQueriesTotal: 0,
        authEventsTotal: 0,
        ordersTotal: 0,
        walletOperationsTotal: 0,
      };
    }
  }