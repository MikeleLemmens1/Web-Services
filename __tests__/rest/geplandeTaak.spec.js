const supertest = require('supertest');
const createServer = require('../../src/createServer');
const { getKnex, tables } = require('../../src/data');

const data = {
  geplande_taken: [
  {
    id: 1,
    naam: "Ellis halen",
    dag: "2023-10-16",
    gezinslid_id: 1,
  },
  {
    id: 2,
    naam: "Ellis halen",
    dag: "2023-10-17",
    gezinslid_id: 1,
  },
  {
    id: 3,
    naam: "Ellis halen",
    dag: "2023-10-18",
    gezinslid_id: 1,
  },
  {
    id: 4,
    naam: "Ellis halen",
    dag: "2023-10-19",
    gezinslid_id: 1,
  },
  {
    id: 5,
    naam: "Ellis halen",
    dag: "2023-10-20",
    gezinslid_id: 1,
  }], 
  gezinnen:
  [{
    id:1,
    familienaam: "Lemmens - De Smet",
    straat: "Binnenslag",
    huisnummer: 63,
    postcode: 9920,
    stad: "Lovendegem"
  }],
  verjaardagen: [
    {
      id: 1,
      dagnummer: 30,
      maandnummer: 12,
      voornaam: "Mikele",
      achternaam: "Lemmens",

    }
  ],
  gezinsleden: [{
    id: 1,
    voornaam: "Mikele",
    email: "mikele.lemmens@hotmail.com",
    wachtwoord: "######",
    gezin_id: 1,
    verjaardag_id: 1
  }
]};


const dataToDelete = {
  verjaardagen: [1],
  gezinnen: [1],
  gezinsleden: [1],
  geplande_taken: [1, 2, 3, 4, 5]
};

describe('Geplande Taken', () => {
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

  const url = '/api/geplande_taken';

  describe('GET /api/geplande_taken', () => {
    beforeAll(async () => {
      await knex(tables.gezin).insert(data.gezinnen);
      await knex(tables.verjaardag).insert(data.verjaardagen);
      await knex(tables.gezinslid).insert(data.gezinsleden);
      await knex(tables.geplandeTaak).insert(data.geplande_taken);
    });
    afterAll(async () => {
      await knex(tables.geplandeTaak)
        .whereIn('id', dataToDelete.geplande_taken)
        .delete();

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
    it('should 200 and return all geplande taken', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(5);

      expect(response.body.items[0]).toEqual({
          id: 1,
          naam: "Ellis halen",
          dag: new Date("2023-10-16").toISOString(),
          gezinslid:{
            id: 1,
            voornaam: "Mikele"
          }
      });
    });
    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });
  describe('GET /api/geplande_taken/:id', () => {
    beforeAll(async () => {
      await knex(tables.gezin).insert(data.gezinnen);
      await knex(tables.verjaardag).insert(data.verjaardagen);
      await knex(tables.gezinslid).insert(data.gezinsleden);
      await knex(tables.geplandeTaak).insert(data.geplande_taken[0]);
      await knex(tables.geplandeTaak).insert(data.geplande_taken[1]);
    });
    afterAll(async () => {
      await knex(tables.geplandeTaak)
        .whereIn('id', dataToDelete.geplande_taken)
        .delete();

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
    it('should 200 and return the requested geplande taken for a gezinslid', async () => {
      const response = await request.get(`${url}/1`);

      expect(response.statusCode).toBe(200);
      expect(response.body.count).toBe(2);
      expect(response.body.geplandeTaken[0]).toEqual(
        {    
          id: 1,
          naam: "Ellis halen",
          dag: new Date("2023-10-16").toISOString(),
          gezinslid:{
            id:1,
            voornaam: "Mikele"
          } 
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

    it('should 400 with invalid geplande taak id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

  });
  describe('POST /api/geplande_taken', () => {
    const geplandeTakenToDelete = [];
    beforeAll(async () => {
      await knex(tables.gezin).insert(data.gezinnen);
      await knex(tables.verjaardag).insert(data.verjaardagen);
      await knex(tables.gezinslid).insert(data.gezinsleden);
    });
    afterAll(async () => {
      await knex(tables.geplandeTaak)
        .whereIn('id', dataToDelete.geplande_taken)
        .delete();

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
    it('should 201 and return the created geplande taak', async () => {
      const response = await request.post(url)
        .send({
          naam: "Ellis halen",
          dag: new Date("2023-10-16").toISOString(),
          gezinslid_id: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.naam).toBe("Ellis halen");
      expect(response.body.dag).toBe(new Date("2023-10-16").toISOString());
      expect(response.body.gezinslid).toEqual({
        id: 1,
        voornaam: "Mikele"
      });

      geplandeTakenToDelete.push(response.body.id);
    });

    it('should 404 when gezinslid does not exist', async () => {
      const response = await request.post(url)
        .send({
          naam: "Ellis halen",
          dag: new Date("2023-10-16").toISOString(),
          gezinslid_id: 100,
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
    it('should 400 when missing gezinslid id', async () => {
      const response = await request.post(url)
        .send({
          naam: "Ellis halen",
          dag: new Date("2023-10-16").toISOString(),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('gezinslid_id');
    });
    it('should 400 when missing naam', async () => {
      const response = await request.post(url)
        .send({
          dag: new Date("2023-10-16").toISOString(),
          gezinslid_id: 100,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('naam');
    });
    it('should 400 when missing dag', async () => {
      const response = await request.post(url)
        .send({
          naam: "Ellis halen",
          gezinslid_id: 100,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('dag');
    });

  });
  describe('PUT /api/geplande_taken', () => {
    beforeAll(async () => {
      await knex(tables.gezin).insert(data.gezinnen);
      await knex(tables.verjaardag).insert(data.verjaardagen);
      await knex(tables.gezinslid).insert(data.gezinsleden);
      await knex(tables.geplandeTaak).insert(data.geplande_taken[0]);
    });
    afterAll(async () => {
      await knex(tables.geplandeTaak)
        .whereIn('id', dataToDelete.geplande_taken)
        .delete();

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
    it('should 200 and return the updated geplande taak', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          naam: "Ellis niet meer halen",
          dag: new Date("2023-10-16").toISOString(),
          gezinslid_id: 1,
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.naam).toBe("Ellis niet meer halen");
      expect(response.body.dag).toBe(new Date("2023-10-16").toISOString());
      expect(response.body.gezinslid).toEqual({
        id: 1,
        voornaam: "Mikele"
      });
    });
    it('should 404 when updating not existing geplande taak', async () => {
      const response = await request.put(`${url}/100`)
        .send({
          naam: "Ellis niet meer halen",
          dag: new Date("2023-10-16").toISOString(),
          gezinslid_id: 1,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er bestaat geen geplande taak met id 100',
        details: {
          id: 100,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });
    it('should 404 when gezinslid does not exist', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          naam: "Ellis niet meer halen",
          dag: new Date("2023-10-16").toISOString(),
          gezinslid_id: 100,
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
  });
  describe('DELETE /api/geplande_taken', () => {
    beforeAll(async () => {
      await knex(tables.gezin).insert(data.gezinnen);
      await knex(tables.verjaardag).insert(data.verjaardagen);
      await knex(tables.gezinslid).insert(data.gezinsleden);
      await knex(tables.geplandeTaak).insert(data.geplande_taken[0]);
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
    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });
    it('should 404 with not existing geplande taak', async () => {
      const response = await request.delete(`${url}/100`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Geen geplande taak met id 100 gevonden',
        details: {
          id: 100,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid geplande taak id', async () => {
      const response = await request.delete(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  })

})