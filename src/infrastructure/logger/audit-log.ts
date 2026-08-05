import { TraceContext } from './trace-context';

/**
 * Categories of critical business operations that require auditing.
 */
export enum AuditCategory {
  AUTHENTICATION = 'AUTHENTICATION',
  WALLET = 'WALLET',
  ORDER = 'ORDER',
  REVIEW = 'REVIEW',
  COUPON = 'COUPON',
  CAMPAIGN = 'CAMPAIGN',
  RETURNS = 'RETURNS',
}

/**
 * Standardized actions for audit events.
 */
export enum AuditAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  APPLIED = 'APPLIED',
}

export interface AuditPayload {
  category: AuditCategory;
  action: AuditAction;
  entityId?: string;
  details: Record<string, unknown>;
}

/**
 * Enterprise Audit Logger.
 * Records highly structured events for compliance, security, and business tracking.
 * Automatically injects trace and user context from the current asynchronous scope.
 */
export class AuditLogger {
  
  /**
   * Records an audit event.
   */
  static log(payload: AuditPayload): void {
    const traceContext = TraceContext.get();
    
    const auditRecord = {
      timestamp: new Date().toISOString(),
      traceId: traceContext?.requestId || 'UNTRACKED',
      correlationId: traceContext?.correlationId || 'UNTRACKED',
      userId: traceContext?.userId || 'SYSTEM',
      environment: traceContext?.environment || process.env.NODE_ENV || 'unknown',
      category: payload.category,
      action: payload.action,
      entityId: payload.entityId,
      details: payload.details,
    };

    // Dispatch the audit record to a secure, append-only destination.
    // In infrastructure layer, we format it securely for log aggregators (e.g., SIEM, Datadog, Splunk).
    this.dispatch(auditRecord);
  }

  /**
   * Internal dispatcher for audit logs.
   */
  private static dispatch(record: Record<string, unknown>): void {
    // Prefixing with [AUDIT] ensures external parsers can easily route these logs 
    // to secure compliance storage separate from standard application logs.
    console.info(`[AUDIT] ${JSON.stringify(record)}`);
  }
}