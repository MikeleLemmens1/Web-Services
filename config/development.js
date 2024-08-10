module.exports = {
  port: 9000,
  logging: {
    level:"silly",
    disabled:false
  },

  cors: {
    origins: ['http://localhost:5173'],
    maxAge: 3 * 60 * 60,
  },
  database: {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    name: 'gezinsplanner_seq',
    database:'gezinsplanner_seq', 
    name_seq: 'gezinsplanner_seq',
    username: 'root2',
    timezone: '+00:00',

    // host: 'vichogent.be',
    // port: 40043,
    // database: '291269ml',
    // username: '291269ml',

    ssl: true,
    omitNull: true,
    // password: '',
    // timezone: '+00:00'
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
      expirationInterval: 1000 * 60 * 60 * 1000, // ms (1000 hour)
      issuer: 'budget.hogent.be',
      audience: 'budget.hogent.be',
    },
  }
  
}