export interface ExtendedRequestOptions extends RequestInit {
  timeout?: number;           // Extension: Request Timeout
  retries?: number;           // Extension: Retry Policy
  requireAuth?: boolean;      // Extension: JWT Authorization Injection flag
  skipErrorHandling?: boolean;// Extension: Global Error Handling bypass
  signal?: AbortSignal;       // Extension: AbortController support
}