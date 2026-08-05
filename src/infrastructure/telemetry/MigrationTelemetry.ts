export enum MigrationEvent {
    STARTED = 'MIGRATION_STARTED',
    COMPLETED = 'MIGRATION_COMPLETED',
    FAILED = 'MIGRATION_FAILED',
    ROLLBACK_ACTIVATED = 'ROLLBACK_ACTIVATED'
  }
  
  export class MigrationTelemetry {
    public static log(event: MigrationEvent, moduleName: string, metadata?: any): void {
      const timestamp = new Date().toISOString();
      console.log(`[TELEMETRY] ${timestamp} | EVENT: ${event} | MODULE: ${moduleName}`, metadata || '');
      
      if (event === MigrationEvent.ROLLBACK_ACTIVATED) {
        console.warn(`[URGENT] System rolled back module [${moduleName}] to Mock implementation!`);
      }
    }
  }