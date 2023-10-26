module.exports = {
  logging: {
    level:"info",
    disabled:false
  },
  host:{
    port:9000
  },
  cors: { // 👈 1
    origins: ['http://localhost:5173'], // 👈 2
    maxAge: 3 * 60 * 60, // 👈 3
  },
}