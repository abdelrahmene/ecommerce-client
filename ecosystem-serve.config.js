module.exports = {
  apps: [
    {
      name: 'ecommerce-client',
      script: 'npx',
      args: 'serve -s build -l 3000',
      cwd: '/var/www/ecommerce-client',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        REACT_APP_API_BASE_URL: 'http://148.230.125.251:4000',
        REACT_APP_ENV: 'production',
        REACT_APP_DEBUG: 'false'
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      error_file: '/var/log/pm2/ecommerce-client-error.log',
      out_file: '/var/log/pm2/ecommerce-client-out.log',
      log_file: '/var/log/pm2/ecommerce-client.log',
      time: true
    }
  ]
};

