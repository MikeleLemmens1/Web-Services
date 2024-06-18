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
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    name: 'gezinsplanner_seq',
    // Needed for migrations
    database:'gezinsplanner_seq', 
    // name_seq: 'gezinsplanner_seq',
    username: 'root2',
    password: 'WebServ2023',
    timezone: '+00:00'

    // host: 'vichogent.be',
    // port: 40043,
    // name: '291269ml',
    // username: 'root2',
    // password: '',
    // timezone: '+00:00'
  },

  
}