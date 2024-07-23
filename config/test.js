
module.exports = {
  logging: {
    level: "silly",
    disabled: false,
  },
  port:9000
  ,  cors: {
    origins: ['http://localhost:5173'],
    maxAge: 3 * 60 * 60,
  },
  database: {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    name: 'gezinsplanner_test',
    username: 'root2',
    password: 'WebServ2023',
    timezone: '+00:00',
    ssl: true,
    omitNull: true,
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

    // host: 'vichogent.be',
    // port: 40043,
    // name: '291269ml',
    // username: '291269ml',
    // password: '',
    // timezone: '+00:00'
  // },
};