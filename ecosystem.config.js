module.exports = {
  apps: [
    {
      name: 'Mdbk',
      script: 'server.ts',

      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],


};