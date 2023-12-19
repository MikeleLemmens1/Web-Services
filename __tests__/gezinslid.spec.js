const supertest = require('supertest');
const createServer = require('../src/createServer');
const { tables, getKnex } = require('../src/data');

const data = {
  gezinsleden: [
    {
      id: 1,
      voornaam: "Mikele",
      email: "mikele.lemmens@hotmail.com",
      wachtwoord: "######",
      gezin_id: 1,
      verjaardag_id: 1
    },
    {
      id: 2,
      voornaam: "Charlotte",
      email: "desmetcharlotte2@gmail.com",
      wachtwoord: "######",
      gezin_id: 1,
      verjaardag_id: 2
    },
    {
      id: 3,
      voornaam: "Ellis",
      email: null,
      wachtwoord: null,
      gezin_id: 1,
      verjaardag_id: 3,
    },
    {
      id: 4,
      voornaam: "Mattia",
      email: "Mattia.Lemmens@hotmail.com",
      wachtwoord: "######",
      gezin_id: 2,
      verjaardag_id: 4
    },
    {
      id: 5,
      voornaam: "Myrthe",
      email: "Myrthe.Roebroek@gmail.com",
      wachtwoord: "######",
      gezin_id: 2,
      verjaardag_id:6
    },
  ],
  verjaardagen: [
    {
      id: 1,
      dagnummer: 30,
      maandnummer: 12,
      voornaam: "Mikele",
      achternaam: "Lemmens",

    },
    {
      id: 2,
      dagnummer: 24,
      maandnummer: 8,
      voornaam: "Charlotte",
      achternaam: "De Smet",

    },
    {
      id: 3,
      dagnummer: 23,
      maandnummer: 9,
      voornaam: "Ellis",
      achternaam: "Lemmens",
      
    },
    {
      id: 4,
      dagnummer: 30,
      maandnummer: 12,
      voornaam: "Mattia",
      achternaam: "Lemmens",
  
    },
    {
      id: 5,
      dagnummer: 15,
      maandnummer: 12,
      voornaam: "Katrijn",
      achternaam: "Goens",
  
    },
    {
      id: 6,
      dagnummer: 10,
      maandnummer: 11,
      voornaam: "Myrthe",
      achternaam: "Roebroek",
  
    }
  ],
  gezinnen: [
    {
      id:1,
      familienaam: "Lemmens - De Smet",
      straat: "Binnenslag",
      huisnummer: 63,
      postcode: 9920,
      stad: "Lovendegem"
    },
    {
      id:2,
      familienaam: "Lemmens - Roebroek",
      straat: "Joost Van De Vondelplein",
      huisnummer: 27,
      postcode: 9940,
      stad: "Ertvelde"
    }
]
};

const dataToDelete = {
  gezinnen: [1, 2],
  verjaardagen: [1,2,3,4,5,6],
  gezinsleden: [1,2,3,4,5]
};

describe('Gezinsleden', () => {
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

  const url = '/api/gezinsleden';

  describe('GET /api/gezinsleden', () => {

    // beforeAll(async () => {
    //   await knex(tables.verjaardag).insert(data.verjaardagen);
    //   await knex(tables.gezin).insert(data.gezinnen);
    //   await knex(tables.gezinslid).insert(data.gezinsleden);
    // });

    // afterAll(async () => {
    //   await knex(tables.gezinslid)
    //     .whereIn('id', dataToDelete.gezinsleden)
    //     .delete();

    //   await knex(tables.verjaardag)
    //     .whereIn('id', dataToDelete.verjaardagen)
    //     .delete();

    //     await knex(tables.gezin)
    //     .whereIn('id', dataToDelete.gezinnen)
    //     .delete();
    // });

    // it('should 200 and return all gezinsleden', async () => {
    //   const response = await request.get(url);
    //   expect(response.status).toBe(200);
    //   expect(response.body.items.length).toBe(5);

    //   expect(response.body.items[1]).toEqual({
    //     id: 2,
    //     voornaam: "Charlotte",
    //     email: "desmetcharlotte2@gmail.com",
    //     wachtwoord: "######",
    //     gezin_id: 1,
    //     verjaardag_id: 2
    //   });
    //   expect(response.body.items[2]).toEqual({
    //     id: 3,
    //     voornaam: "Ellis",
    //     email: null,
    //     wachtwoord: null,
    //     gezin_id: 1,
    //     verjaardag_id: 3,
    //   });
    // });

    // it('should 400 when given an argument', async () => {
    //   const response = await request.get(`${url}?invalid=true`);

    //   expect(response.statusCode).toBe(400);
    //   expect(response.body.code).toBe('VALIDATION_FAILED');
    //   expect(response.body.details.query).toHaveProperty('invalid');
    // });
  });

  describe('GET /api/gezinsleden/:id', () => {

    beforeAll(async () => {
      await knex(tables.verjaardag).insert(data.verjaardagen);
      await knex(tables.gezin).insert(data.gezinnen);
      await knex(tables.gezinslid).insert(data.gezinsleden[0]);
    });

    afterAll(async () => {
      await knex(tables.gezinslid)
        .whereIn('id', dataToDelete.gezinsleden)
        .delete();

      await knex(tables.verjaardag)
        .whereIn('id', dataToDelete.verjaardagen)
        .delete();

      await knex(tables.gezin)
        .whereIn('id', dataToDelete.gezinnen)
        .delete();
    });

    it('should 200 and return the requested gezinslid', async () => {
      const response = await request.get(`${url}/1`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([{
        id: 1,
        voornaam: "Mikele",
        email: "mikele.lemmens@hotmail.com",
        wachtwoord: "######",
        gezin: {
          id: 1,
          familienaam: "Lemmens - De Smet"
        },
        verjaardag: 1
      }]);
    });

    it('should 404 when requesting not existing gezinslid', async () => {
      const response = await request.get(`${url}/100`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er bestaat geen gezinslid met id 100',
        details: {
          id: 100,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid gezinslid id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });

  describe('POST /api/gezinsleden', () => {
    const gezinsledenToDelete = [];

    beforeAll(async () => {
      await knex(tables.verjaardag).insert(data.verjaardagen);
      await knex(tables.gezin).insert(data.gezinnen);
    });

    afterAll(async () => {
      await knex(tables.gezinslid)
        .whereIn('id', gezinsledenToDelete)
        .delete();

      await knex(tables.verjaardag)
        .whereIn('id', dataToDelete.verjaardagen)
        .delete();

      await knex(tables.gezin)
        .whereIn('id', dataToDelete.gezinnen)
        .delete();
    });

    // it('should 201 and return the created gezinslid', async () => {
    //   const response = await request.post(url)
    //     .send({
    //       voornaam: "Louie",
    //       email: "",
    //       wachtwoord: "######",
    //       gezin_id: 1,
    //       verjaardag_id:6
    //     });

    //   expect(response.status).toBe(201);
    //   expect(response.body.id).toBeTruthy();
    //   expect(response.body.voornaam).toBe("Louie");
    //   expect(response.body.email).toBe("");
    //   expect(response.body.wachtwoord).toBe("######");
    //   expect(response.body.verjaardag).toEqual({
    //     id: 6,
    //     dagnummer: 10,
    //     maandnummer: 11,
    //     voornaam: "Myrthe",
    //     achternaam: "Roebroek",
    //   });
    //   expect(response.body.gezin).toEqual({
    //     id:1,
    //     familienaam: "Lemmens - De Smet",
    //     straat: "Binnenslag",
    //     huisnummer: 63,
    //     postcode: 9920,
    //     stad: "Lovendegem"
    //   });

    //   gezinsledenToDelete.push(response.body.id);
    // });

    // it('should 404 when verjaardag does not exist', async () => {
    //   const response = await request.post(url)
    //     .send({
    //       voornaam: "Louie",
    //       email: "",
    //       wachtwoord: "######",
    //       gezin_id: 1,
    //       verjaardag_id:100
    //     });

    //   expect(response.statusCode).toBe(404);
    //   expect(response.body).toMatchObject({
    //     code: 'NOT_FOUND',
    //     message: 'Er bestaat geen verjaardag met id 100',
    //     details: {
    //       id: 100,
    //     },
    //   });
    //   expect(response.body.stack).toBeTruthy();
    // });

    it('should 400 when missing voornaam', async () => {
      const response = await request.post(url)
        .send({
          email: "",
          wachtwoord: "######",
          gezin_id: 1,
          verjaardag_id:6
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('voornaam');
    });

  });

  describe('PUT /api/gezinsleden/:id', () => {

    beforeAll(async () => {
      await knex(tables.verjaardag).insert(data.verjaardagen);
      await knex(tables.gezin).insert(data.gezinnen);
      await knex(tables.gezinslid).insert(data.gezinsleden[0]);
    });

    afterAll(async () => {
      await knex(tables.gezinslid)
        .whereIn('id', dataToDelete.gezinsleden)
        .delete();

      await knex(tables.gezin)
        .whereIn('id', dataToDelete.gezinnen)
        .delete();

      await knex(tables.verjaardag)
        .whereIn('id', dataToDelete.verjaardagen)
        .delete();
    });

    // it('should 200 and return the updated gezinslid', async () => {
    //   const response = await request.put(`${url}/1`)
    //     .send({
    //       voornaam: "Mikele",
    //       email: "mikele.lemmens@hotmail.com",
    //       wachtwoord: "######",
    //       gezin_id:2,
    //       verjaardag_id:1
    //     });

    //   expect(response.statusCode).toBe(200);
    //   expect(response.body.id).toBeTruthy();
    //   expect(response.body.voornaam).toBe("Mikele");
    //   expect(response.body.email).toBe("mikele.lemmens@hotmail.com");
    //   expect(response.body.wachtwoord).toBe("######");
    //   expect(response.body.gezin).toEqual({
    //     id: 2,
    //     familienaam: 'Lemmens - Roebroek',
    //   });
    //   expect(response.body.verjaardag_id).toBe(1);
    // });

    // it('should 404 when updating not existing gezinslid', async () => {
    //   const response = await request.put(`${url}/100`)
    //     .send({
    //       voornaam: "Mikele",
    //       email: "mikele.lemmens@hotmail.com",
    //       wachtwoord: "######",
    //       gezin_id:1,
    //       verjaardag_id:1
    //     });

    //   expect(response.statusCode).toBe(404);
    //   expect(response.body).toMatchObject({
    //     code: 'NOT_FOUND',
    //     message: 'Er bestaat geen gezinslid met id 100',
    //     details: {
    //       id: 100,
    //     },
    //   });
    //   expect(response.body.stack).toBeTruthy();
    // });

    // it('should 404 when gezin does not exist', async () => {
    //   const response = await request.put(`${url}/1`)
    //     .send({
    //       voornaam: "Mikele",
    //       email: "mikele.lemmens@hotmail.com",
    //       wachtwoord: "######",
    //       gezin_id:100,
    //       verjaardag_id:1
    //     });

    //   expect(response.statusCode).toBe(404);
    //   expect(response.body).toMatchObject({
    //     code: 'NOT_FOUND',
    //     message: 'Er bestaat geen gezin met id 100',
    //     details: {
    //       id: 100,
    //     },
    //   });
    //   expect(response.body.stack).toBeTruthy();
    // });

    it('should 400 when missing voornaam', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          email: "mikele.lemmens@hotmail.com",
          wachtwoord: "######",
          gezin_id:1,
          verjaardag_id:1
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('voornaam');
    });
    // TODO FK's moeten notNullable zijn
    // it('should 400 when missing placeId', async () => {
    //   const response = await request.put(`${url}/4`)
    //     .send({
    //       amount: 102,
    //       date: '2021-05-27T13:00:00.000Z',
    //       userId: 1,
    //     });

    //   expect(response.statusCode).toBe(400);
    //   expect(response.body.code).toBe('VALIDATION_FAILED');
    //   expect(response.body.details.body).toHaveProperty('placeId');
    // });

    // it('should 400 when missing userId', async () => {
    //   const response = await request.put(`${url}/4`)
    //     .send({
    //       amount: 102,
    //       date: '2021-05-27T13:00:00.000Z',
    //       placeId: 1,
    //     });

    //   expect(response.statusCode).toBe(400);
    //   expect(response.body.code).toBe('VALIDATION_FAILED');
    //   expect(response.body.details.body).toHaveProperty('userId');
    // });
  });

  describe('DELETE /api/gezinsleden/:id', () => {

    beforeAll(async () => {
      await knex(tables.verjaardag).insert(data.verjaardagen);
      await knex(tables.gezin).insert(data.gezinnen);
      await knex(tables.gezinslid).insert(data.gezinsleden[0]);
    });

    afterAll(async () => {
      await knex(tables.verjaardag)
        .whereIn('id', dataToDelete.verjaardagen)
        .delete();

      await knex(tables.gezin)
        .whereIn('id', dataToDelete.gezinnen)
        .delete();
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing gezinslid', async () => {
      const response = await request.delete(`${url}/100`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Geen gezinslid met id 100 gevonden',
        details: {
          id: 100,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid gezinslid id', async () => {
      const response = await request.delete(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });
});