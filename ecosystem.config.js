module.exports = {
  apps: [
    {
      name: 'artistkatta-web',
      script: 'npm',
      args: 'run start',
      cwd: '/var/www/Server',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_API_URL: 'https://www.artistkatta.com/api'
      }
    }
  ]
}
