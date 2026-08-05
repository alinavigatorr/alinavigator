const SENSITIVE_KEYS = ['password', 'token', 'secret', 'authorization', 'cookie', 'creditCard', 'cvv', 'payment'];

export class SecureLogger {
  private static sanitize(data: any): any {
    if (!data || typeof data !== 'object') return data;

    if (Array.isArray(data)) {
      return data.map(item => this.sanitize(item));
    }

    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (SENSITIVE_KEYS.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
        sanitized[key] = '***REDACTED***';
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  static info(message: string, meta?: any) {
    console.log(`[INFO]: ${message}`, meta ? JSON.stringify(this.sanitize(meta)) : '');
  }

  static error(message: string, error?: any) {
    console.error(`[ERROR]: ${message}`, error ? JSON.stringify(this.sanitize(error)) : '');
  }
}