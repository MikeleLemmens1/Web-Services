const supertest = require('supertest');
const createServer = require('../src/createServer');
const { getKnex, tables } = require('../src/data');

const data = 
{ 
  gezinnen: [
    {
      // gezinsId: 1,
      familienaam: "Lemmens - De Smet",
      straat: "Binnenslag",
      huisnummer: 63,
      postcode: 9920,
      stad: "Lovendegem"
    },
    {
      // gezinsId: 2,
      familienaam: "Lemmens - Roebroek",
      straat: "Joost Van De Vondelplein",
      huisnummer: 27,
      postcode: 9940,
      stad: "Ertvelde"
    }
]
};
const dataToDelete = {
  gezinnen: [1,2],
};

describe('Gezinnen', () => {
  let server;
  let request;
  let knex;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    knex = getKnex();
  });

  afterAll(async () => {
    await server.stop();
  });
  const url = '/api/gezinnen';

  describe('GET /api/gezinnen', () => {
    beforeAll(async () => {
      await knex(tables.gezin).insert(data.gezinnen);
    });
    afterAll(async () => {
      await knex(tables.gezin)
      .whereIn('id',dataToDelete.gezinnen)
      .delete();
    });

    it('should 200 and return all gezinnen', async () => {
      const response = await request.get(url); 
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);
    });
  });
});
