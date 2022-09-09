
module.exports = {
  apps: [
    {
      name              : 'jmsbdg-backend',
      script            : './dist/src/index.js',
      node_args         : '--require=./tspaths.js',
      cwd               : './',
      autorestart       : true,
      watch             : false,
      max_memory_restart: '1G',
      env               : { NODE_ENV: 'development' },
      env_production    : { NODE_ENV: 'production' }
    }
  ]
}
