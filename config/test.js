
module.exports = {
  logging: {
    level: "silly",
    disabled: false,
  },
  host:{
    port:9000
  },
  cors: { // 👈 1
    origins: ['http://localhost:5173'], // 👈 2
    maxAge: 3 * 60 * 60, // 👈 3
  },
  database: {
    client: 'mysql2',
    host: 'localhost',
    port: 3306,
    name: 'gezinsplanner_test',
    username: 'root2',
    password: '',
    timezone: '+00:00'
  },
};