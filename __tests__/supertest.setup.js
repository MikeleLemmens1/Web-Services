const supertest = require('supertest');
const createServer = require('../src/createServer');
const { getSequelize } = require('../src/data/index');


const login = async (supertest) => {
  const response = await supertest.post('/api/gezinsleden/login').send({
    email: 'test.user@gmail.com',
    wachtwoord: '12345678',
  });
  if(response.status !== 200){
    throw new Error(response.body.message || 'Unknown error occured');
  }

  return `Bearer ${response.body.token}`;
};

const loginUsertest = async (supertest) => {
  const response = await supertest.post('/api/gezinsleden/login').send({
    email: 'test1@domain.com',
    wachtwoord: '12345678',
    
  });

  if(response.status !== 200){
    throw new Error(response.body.message || 'Unknown error occured');
  }

  return `Bearer ${response.body.token}`;
};

const loginAdmin = async (supertest) => {
  const response = await supertest.post('/api/gezinsleden/login').send({
    email: 'test.admin@gmail.com',
    wachtwoord: '12345678',
  });

  if(response.status !== 200){
    throw new Error(response.body.message || 'Unknown error occured');
  }

  return `Bearer ${response.body.token}`;
};

const withServer = (setter) => {
  let server;

  beforeAll(async () => {
    server = await createServer();
    setter({
      sequelize: getSequelize(),
      supertest: supertest(server.getApp().callback()),
    });
  });

  afterAll(async () => {
    await server.stop();
  });
}


module.exports = {
  login,
  loginUsertest,
  loginAdmin,
  withServer,
};