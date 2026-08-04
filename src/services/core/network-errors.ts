export class BaseNetworkError extends Error {
  constructor(public code: string, message: string, public status?: number, public data?: any) {
    super(message);
    this.name = 'BaseNetworkError';
  }
}

export class HttpError extends BaseNetworkError {
  constructor(status: number, message: string, data?: any) {
    super('HTTP_ERROR', message, status, data);
    this.name = 'HttpError';
  }
}

export class TimeoutError extends BaseNetworkError {
  constructor(message: string = 'The request timed out') {
    super('TIMEOUT_ERROR', message);
    this.name = 'TimeoutError';
  }
}

export class UnauthorizedError extends BaseNetworkError {
  constructor(message: string = 'Unauthorized access') {
    super('UNAUTHORIZED', message, 401);
    this.name = 'UnauthorizedError';
  }
}