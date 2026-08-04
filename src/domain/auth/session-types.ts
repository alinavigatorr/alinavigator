export interface Session {
    sessionId: string;
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
    issuedAt: Date;
    expiresAt: Date;
    lastActivity: Date;
  }