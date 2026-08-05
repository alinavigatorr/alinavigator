import { ApiResponse, ApiErrorFactory } from './errors/ApiResponses';
import { ApiRegistry } from './ApiRegistry';
import { ApiTelemetry, ApiEventType } from '../telemetry/ApiTelemetry';

export interface ApiClientOptions {
  timeoutMs: number;
  useRealApi: boolean;
}

export class ApiClient {
  constructor(private readonly options: ApiClientOptions) {}

  public async get<T>(path: string): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('GET', path);
  }

  public async post<T>(path: string, body: any): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('POST', path, body);
  }

  private async executeRequest<T>(method: string, path: string, body?: any): Promise<ApiResponse<T>> {
    const startTime = performance.now();
    ApiTelemetry.log(ApiEventType.REQUEST_STARTED, path, undefined, { method });

    try {
      if (!this.options.useRealApi) {
        // Fallback: If not using real API, return mock immediately without hitting registry
        const duration = performance.now() - startTime;
        ApiTelemetry.log(ApiEventType.REQUEST_COMPLETED, path, duration, { mocked: true });
        return ApiErrorFactory.success({} as T); // Mock placeholder
      }

      // Check if endpoint is registered
      const handler = ApiRegistry.resolve(path);
      if (!handler) {
        ApiTelemetry.log(ApiEventType.VALIDATION_ERROR, path, performance.now() - startTime, { error: 'Route not found' });
        return ApiErrorFactory.notFound(`Endpoint ${path} not registered`);
      }

      // Execute with simple timeout placeholder
      const result = await handler({ method, body });
      const duration = performance.now() - startTime;
      
      ApiTelemetry.log(ApiEventType.REQUEST_COMPLETED, path, duration);
      return ApiErrorFactory.success(result);

    } catch (error: any) {
      const duration = performance.now() - startTime;
      ApiTelemetry.log(ApiEventType.UNHANDLED_EXCEPTION, path, duration, { error: error.message });
      return ApiErrorFactory.internalError(error.message);
    }
  }
}