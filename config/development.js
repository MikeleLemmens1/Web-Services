module.exports = {
  port: 9000,
  logging: {
    level:"silly",
    disabled:false
  },

  cors: { // 👈 1
    origins: ['http://localhost:5173'],
    maxAge: 3 * 60 * 60, // 👈 3
  },
  database: {
    client: 'mysql2',
    host: 'localhost',
    port: 3306,
    name: 'gezinsplanner',
    username: 'root2',
    password: '',
    timezone: '+00:00'
  },
}