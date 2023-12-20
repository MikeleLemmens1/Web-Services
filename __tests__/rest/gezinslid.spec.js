const supertest = require('supertest');
const createServer = require('../../src/createServer');
const { tables, getKnex } = require('../../src/data');

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
      verjaardag_id: 1
    },
    {
      id: 3,
      voornaam: "Ellis",
      email: null,
      wachtwoord: null,
      gezin_id: 1,
      verjaardag_id: 1,
    },
    {
      id: 4,
      voornaam: "Mattia",
      email: "Mattia.Lemmens@hotmail.com",
      wachtwoord: "######",
      gezin_id: 1,
      verjaardag_id: 1
    },
    {
      id: 5,
      voornaam: "Myrthe",
      email: "Myrthe.Roebroek@gmail.com",
      wachtwoord: "######",
      gezin_id: 1,
      verjaardag_id:1
    },
  ],
  verjaardagen: [
    {
      id: 1,
      dagnummer: 30,
      maandnummer: 12,
      voornaam: "Mikele",
      achternaam: "Lemmens",

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
]
};

const dataToDelete = {
  gezinnen: [1],
  verjaardagen: [1],
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

    beforeAll(async () => {
      await knex(tables.verjaardag).insert(data.verjaardagen);
      await knex(tables.gezin).insert(data.gezinnen);
      await knex(tables.gezinslid).insert(data.gezinsleden);
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

    it('should 200 and return all gezinsleden', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(5);

      expect(response.body.items[0]).toEqual({
        id: 2,
        voornaam: "Charlotte",
        email: "desmetcharlotte2@gmail.com",
        wachtwoord: "######",
        gezin: {
          id: 1,
          familienaam: "Lemmens - De Smet"
        },
        verjaardag: 1
      });
    //   expect(response.body.items[2]).toEqual({
    //     id: 3,
    //     voornaam: "Ellis",
    //     email: null,
    //     wachtwoord: null,
    //     gezin_id: 1,
    //     verjaardag_id: 3,
    //   });
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });

  describe('GET /api/gezinsleden/:id', () => {

    beforeAll(async () => {
      await knex(tables.verjaardag).insert(data.verjaardagen);
      await knex(tables.gezin).insert(data.gezinnen);
      await knex(tables.gezinslid).insert(data.gezinsleden[0]);
      // await knex(tables.gezinslid).insert(data.gezinsleden[1]);
      // await knex(tables.gezinslid).insert(data.gezinsleden[2]);
    });

    afterAll(async () => {
      await knex(tables.gezin)
        .whereIn('id', dataToDelete.gezinnen)
        .delete();

      await knex(tables.verjaardag)
        .whereIn('id', dataToDelete.verjaardagen)
        .delete();
      
        await knex(tables.gezinslid)
        .whereIn('id', dataToDelete.gezinsleden)
        .delete();
    });

    //TODO Flow aanpassen zodat een gezin wordt geretourneerd ipv een gezinslid
    it('should 200 and return the requested gezinslid', async () => {
      const response = await request.get(`${url}/1`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
      //   [{
      //   id: 1,
      //   voornaam: "Mikele",
      //   email: "mikele.lemmens@hotmail.com",
      //   wachtwoord: "######",
      //   gezin: {
      //     id: 1,
      //     familienaam: "Lemmens - De Smet"
      //   },
      //   verjaardag: 1
      // },
      // {
      //   id: 2,
      //   voornaam: "Charlotte",
      //   email: "desmetcharlotte2@gmail.com",
      //   wachtwoord: "######",
      //   gezin: {
      //     id: 1,
      //     familienaam: "Lemmens - De Smet"
      //   },
      //   verjaardag: 1
      // },
      // {
      //   id: 3,
      //   voornaam: "Ellis",
      //   email: null,
      //   wachtwoord: null,
      //   gezin: {
      //     id: 1,
      //     familienaam: "Lemmens - De Smet"
      //   },
      //   verjaardag: 1
      // }]
      {
          id: 1,
          voornaam: "Mikele",
          email: "mikele.lemmens@hotmail.com",
          wachtwoord: "######",
          gezin: {
            id: 1,
            familienaam: "Lemmens - De Smet"
          },
          verjaardag: 1
        }
      );
    });

    it('should 404 when requesting not existing gezinslid', async () => {
      const response = await request.get(`${url}/4`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er bestaat geen gezinslid met id 4',
        details: {
          id: 4,
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

    it('should 201 and return the created gezinslid', async () => {
      const response = await request.post(url)
        .send({
          voornaam: "Louie",
          email: "test",
          wachtwoord: "######",
          gezin_id: 1,
          verjaardag_id:1
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.voornaam).toBe("Louie");
      expect(response.body.email).toBe("test");
      expect(response.body.wachtwoord).toBe("######");
      expect(response.body.verjaardag).toEqual(1
      //   {
      //   id: 1,
      //   dagnummer: 30,
      //   maandnummer: 12,
      //   voornaam: "Mikele",
      //   achternaam: "Lemmens",
      // }
      );
      expect(response.body.gezin).toEqual({
        id: 1,
        familienaam: "Lemmens - De Smet",
        // straat: "Binnenslag",
        // huisnummer: 63,
        // postcode: 9920,
        // stad: "Lovendegem"
      });

      gezinsledenToDelete.push(response.body.id);
    });

    it('should 404 when verjaardag does not exist', async () => {
      const response = await request.post(url)
        .send({
          voornaam: "Louie",
          email: "test",
          wachtwoord: "######",
          gezin_id: 1,
          verjaardag_id:100
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er bestaat geen verjaardag met id 100',
        details: {
          id: 100,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

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

    it('should 200 and return the updated gezinslid', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          voornaam: "Mikele2",
          email: "mikele.lemmens@hotmail.com",
          wachtwoord: "######",
          gezin_id:1,
          verjaardag_id:1
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.voornaam).toBe("Mikele2");
      expect(response.body.email).toBe("mikele.lemmens@hotmail.com");
      expect(response.body.wachtwoord).toBe("######");
      expect(response.body.gezin).toEqual({
        id: 1,
        familienaam: "Lemmens - De Smet",
      });
      expect(response.body.verjaardag).toBe(1);
    });

    it('should 404 when updating not existing gezinslid', async () => {
      const response = await request.put(`${url}/100`)
        .send({
          voornaam: "Mikele",
          email: "mikele.lemmens@hotmail.com",
          wachtwoord: "######",
          gezin_id:1,
          verjaardag_id:1
        });

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

    it('should 404 when gezin does not exist', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          voornaam: "Mikele",
          email: "mikele.lemmens@hotmail.com",
          wachtwoord: "######",
          gezin_id:100,
          verjaardag_id:1
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er bestaat geen gezin met id 100',
        details: {
          id: 100,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

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
    it('should 400 when missing gezin_id', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          email: "mikele.lemmens@hotmail.com",
          wachtwoord: "######",
          voornaam: "Mikele",
          verjaardag_id:1
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('gezin_id');
    });
    it('should 400 when missing verjaardag_id', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          email: "mikele.lemmens@hotmail.com",
          wachtwoord: "######",
          voornaam: "Mikele",
          gezin_id:1
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('verjaardag_id');
    });

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