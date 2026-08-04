import { prisma } from '../../database/prisma/prisma-client';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    database: {
      status: 'up' | 'down';
      latencyMs?: number;
    };
    memory: {
      rssMb: number;
      heapUsedMb: number;
      heapTotalMb: number;
    };
  };
}

/**
 * Enterprise Health Check Service.
 * Evaluates database connectivity, memory usage, and runtime status.
 */
export class HealthCheckService {
  static async check(): Promise<HealthStatus> {
    const startTime = Date.now();
    let dbStatus: 'up' | 'down' = 'up';
    let latencyMs = 0;

    try {
      // Lightweight ping to PostgreSQL via Prisma
      await prisma.$queryRaw`SELECT 1`;
      latencyMs = Date.now() - startTime;
    } catch (error) {
      dbStatus = 'down';
    }

    const memoryUsage = process.memoryUsage();

    const isHealthy = dbStatus === 'up';

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: {
          status: dbStatus,
          latencyMs,
        },
        memory: {
          rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
          heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        },
      },
    };
  }
}