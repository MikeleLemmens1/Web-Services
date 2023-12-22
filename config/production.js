module.exports = {
  logging: {
    level:"info",
    disabled:false
  },
  cors: { // 👈 1
    origins: ['http://localhost:5173'], // 👈 2
    maxAge: 3 * 60 * 60, // 👈 3
  },
  database: {
    client: 'mysql2',
    host: 'localhost',
    port: 3306,
    name: 'gezinsplanner',
    timezone: '+00:00'
  },
}