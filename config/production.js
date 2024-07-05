module.exports = {
  logging: {
    level:"info",
    disabled:false
  },
  cors: {
    origins: ['http://localhost:5173'],
    maxAge: 3 * 60 * 60,
  },
  port: 9000,
  database: {
    dialect: 'mysql',
    host: 'vichogent.be',
    database: '291269ml',
    username: '291269ml',
    password: 'SnKQ1eNSvgyaCkzOFFFU',
    port: 40043,
    ssl: true,
    omitNull: true,
    timezone: '+00:00'
  },
  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },

    jwt: {
      secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
      expirationInterval: 60 * 60 * 1000, // ms (1 hour)
      issuer: 'budget.hogent.be',
      audience: 'budget.hogent.be',
    },
  },
}