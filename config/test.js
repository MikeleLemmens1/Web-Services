
module.exports = {
  logging: {
    level: "silly",
    disabled: false,
  },
  host:{
    port:9000
  },
  cors: {
    origins: ['http://localhost:5173'],
    maxAge: 3 * 60 * 60,
  },
  database: {
    client: 'mysql2',
    host: 'localhost',
    port: 3306,
    name: 'gezinsplanner_test',
    username: 'root2',
    password: '',
    timezone: '+00:00'

    // host: 'vichogent.be',
    // port: 40043,
    // name: '291269ml',
    // username: '291269ml',
    // password: '',
    // timezone: '+00:00'
  },
};