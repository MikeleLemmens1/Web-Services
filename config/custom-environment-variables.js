module.exports = {
  env: 'NODE_ENV',
  port: 'PORT',
  database: {
    host: 'DATABASE_HOST',
    port: 'DATABASE_PORT',
    name: 'DATABASE_NAME',
    database: 'DATABASE_DATABASE',
    username: 'DATABASE_USERNAME',
    password: 'DATABASE_PASSWORD',
  },
  auth: {
    jwt: {
      secret: 'AUTH_JWT_SECRET',
    },
  },
};