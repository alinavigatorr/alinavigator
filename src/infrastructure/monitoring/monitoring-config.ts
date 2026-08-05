export const MonitoringConfig = {
    alerts: {
      highErrorRateThresholdPercent: 5,
      maxResponseTimeMs: 1200,
      queueBacklogLimit: 500,
      emailFailureRatePercent: 3,
    },
    exporters: {
      prometheusEndpoint: '/api/metrics/prometheus',
      healthEndpoint: '/health',
      readinessEndpoint: '/readiness',
      livenessEndpoint: '/liveness',
    },
  };