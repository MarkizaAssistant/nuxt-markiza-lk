module.exports = {
  apps: [
    {
      name: 'MarkizaLK',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
