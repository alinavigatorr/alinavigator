export enum ApiEventType {
    REQUEST_STARTED = 'API_REQUEST_STARTED',
    REQUEST_COMPLETED = 'API_REQUEST_COMPLETED',
    VALIDATION_ERROR = 'API_VALIDATION_ERROR',
    UNHANDLED_EXCEPTION = 'API_UNHANDLED_EXCEPTION'
  }
  
  export class ApiTelemetry {
    public static log(event: ApiEventType, path: string, durationMs?: number, metadata?: any): void {
      const time = new Date().toISOString();
      let message = `[API TELEMETRY] ${time} | ${event} | PATH: ${path}`;
      
      if (durationMs !== undefined) {
        message += ` | DURATION: ${durationMs}ms`;
      }
      
      console.log(message, metadata || '');
    }
  }