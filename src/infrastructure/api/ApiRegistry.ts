type RequestHandler = (req: any) => Promise<any>;

export class ApiRegistry {
  private static endpoints: Map<string, RequestHandler> = new Map();

  public static register(path: string, handler: RequestHandler): void {
    this.endpoints.set(path, handler);
  }

  public static resolve(path: string): RequestHandler | undefined {
    return this.endpoints.get(path);
  }

  public static listEndpoints(): string[] {
    return Array.from(this.endpoints.keys());
  }
}