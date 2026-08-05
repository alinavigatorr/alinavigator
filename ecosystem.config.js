module.exports = {
  apps: [
    {
      name: 'marketplace-app',
      script: '.next/standalone/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      max_memory_restart: '500M',
      restart_delay: 3000,
      min_uptime: '10s',
      max_restarts: 5,
      out_file: '/root/.pm2/logs/marketplace-app-out.log',
      error_file: '/root/.pm2/logs/marketplace-app-error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};