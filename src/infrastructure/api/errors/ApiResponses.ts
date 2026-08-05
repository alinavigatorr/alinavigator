export enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
      code: HttpStatusCode;
      message: string;
      details?: any;
    };
  }
  
  export class ApiErrorFactory {
    public static validationError(details: any): ApiResponse {
      return { success: false, error: { code: HttpStatusCode.BAD_REQUEST, message: 'Validation Error', details } };
    }
    public static notFound(message: string): ApiResponse {
      return { success: false, error: { code: HttpStatusCode.NOT_FOUND, message } };
    }
    public static internalError(message: string): ApiResponse {
      return { success: false, error: { code: HttpStatusCode.INTERNAL_SERVER_ERROR, message: 'Internal Server Error' } };
    }
    public static success<T>(data: T): ApiResponse<T> {
      return { success: true, data };
    }
  }