const supertest = require('supertest');
const createServer = require('../../src/createServer');
const { tables, getKnex } = require('../../src/data');
const boodschappen = require('../../src/rest/boodschappen');

const data = {
  gezinnen: {
    id: 1,
    familienaam: "Lemmens - De Smet",
    straat: "Binnenslag",
    huisnummer: 63,
    postcode: 9920,
    stad: "Lovendegem"
  },
  boodschappen:
    [
      {
        id: 1,
        naam: "Choco",
        winkel: "Colruyt",
        hoeveelheid: "1 pot",
        gezin_id: 1,
      },
      {
        id: 2,
        naam: "Hondenbrokken",
        winkel: null,
        hoeveelheid: null,
        gezin_id: 1
      },
      {
        id: 3,
        naam: "Kaas",
        winkel: "Colruyt",
        hoeveelheid: null,
        gezin_id:1
      },
      {
        id: 4,
        naam: "Pampers",
        winkel: "Kruidvat",
        hoeveelheid: null,
        gezin_id: 1
      },
      {
        id: 5,
        naam: "Pampers",
        winkel: "Kruidvat",
        hoeveelheid: null,
        gezin_id: 1
      }
    ]
};

const dataToDelete = {
  gezinnen: [1],
  boodschappen: [1, 2, 3, 4, 5]
};

describe('Boodschappen', () => {
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

  const url = '/api/boodschappen';

  describe('GET /api/boodschappen', () => {
    beforeAll(async () => {
      await getKnex()(tables.gezin).insert(data.gezinnen);
      await getKnex()(tables.boodschap).insert(data.boodschappen);
    });
    afterAll(async () => {
      await knex(tables.boodschap)
      .whereIn('id', dataToDelete.boodschappen)
      .delete();

      await knex(tables.gezin)
      .whereIn('id', dataToDelete.gezinnen)
      .delete();
    });
    it('should 200 and return all boodschappen', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(5);

      expect(response.body.items[1]).toEqual({
        id: 1,
        naam: "Choco",
        winkel: "Colruyt",
        hoeveelheid: "1 pot",
        gezin_id: 1,
      });
    });
    it('should 200 and return all boodschappen voor een gekozen winkel en gezin', async () => {
      const response = await request.get(`${url}?winkel=Kruidvat&gezin_id=1`);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);

      expect(response.body.items[0]).toEqual({
        id: 4,
        naam: "Pampers",
        winkel: "Kruidvat",
        hoeveelheid: null,
        gezin_id: 1
      });
    });
    it('should 200 and return all boodschappen voor een gekozen gezin', async () => {
      const response = await request.get(`${url}?gezin_id=1`);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(5);

      expect(response.body.items[0]).toEqual({
        id: 1,
        naam: "Choco",
        winkel: "Colruyt",
        hoeveelheid: "1 pot",
        gezin_id: 1,
      });
    });
  });
  describe('GET /api/boodschappen/:id', () => {
    beforeAll(async () => {
      await getKnex()(tables.gezin).insert(data.gezinnen);
      await getKnex()(tables.boodschap).insert(data.boodschappen[0]);
    });
    afterAll(async () => {
      await knex(tables.boodschap)
      .whereIn('id', dataToDelete.boodschappen)
      .delete();

    await knex(tables.gezin)
      .whereIn('id', dataToDelete.gezinnen)
      .delete();
    });
    it('should 200 and return requested boodschap', async () => {
      const response = await request.get(`${url}/1`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        naam: "Choco",
        winkel: "Colruyt",
        hoeveelheid: "1 pot",
        gezin_id: 1,
      });
    });
    it('should 404 when requesting not existing boodschap', async () => {
      const response = await request.get(`${url}/4`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er bestaat geen boodschap met id 4',
        details: {
          id: 4,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid boodschap id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
    
  });
  describe('POST /api/boodschappen/', () => {
    const boodschappenToDelete = [];

    beforeAll(async () => {
      await getKnex()(tables.gezin).insert(data.gezinnen);
    });
    afterAll(async () => {
      await knex(tables.boodschap)
      .whereIn('id', boodschappenToDelete)
      .delete();

      await knex(tables.gezin)
      .whereIn('id', dataToDelete.gezinnen)
      .delete();
    });

    it('should 201 and return the created boodschap', async () => {
      const response = await request.post(url)
        .send({
          naam: "Choco",
          winkel: "Colruyt",
          hoeveelheid: "1 pot",
          gezin_id: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.naam).toBe("Choco");
      expect(response.body.hoeveelheid).toBe("1 pot");
      boodschappenToDelete.push(response.body.id);
     
    });
    
    it('should 404 when gezin does not exist', async () => {
      const response = await request.post(url)
        .send({
          naam: "Choco",
          winkel: "Colruyt",
          hoeveelheid: "1 pot",
          gezin_id: 100,
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

    it('should 400 when missing gezin id', async () => {
      const response = await request.post(url)
        .send({
          naam: "Choco",
          winkel: "Colruyt",
          hoeveelheid: "1 pot",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('gezin_id');
    });
    
    it('should 400 when missing naam', async () => {
      const response = await request.post(url)
        .send({
          winkel: "Colruyt",
          hoeveelheid: "1 pot",
          gezin_id: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('naam');
    });

  });
  describe('PUT /api/boodschappen/:id', () => {

    beforeAll(async () => {
      await getKnex()(tables.gezin).insert(data.gezinnen);
      await getKnex()(tables.boodschap).insert(data.boodschappen[0]);
    });
    afterAll(async () => {
      await knex(tables.boodschap)
      .whereIn('id', dataToDelete.boodschappen)
      .delete();

    await knex(tables.gezin)
      .whereIn('id', dataToDelete.gezinnen)
      .delete();
    });
    it('should 200 and return the updated boodschap', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          naam: "Choco met brokken",
          winkel: "Colruyt",
          hoeveelheid: "1 pot",
          gezin_id: 1,
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.naam).toBe("Choco met brokken");
      expect(response.body.hoeveelheid).toBe("1 pot");
    });

    it('should 404 when updating not existing boodschap', async () => {
      const response = await request.put(`${url}/100`)
        .send({
          naam: "Choco met brokken",
          winkel: "Colruyt",
          hoeveelheid: "1 pot",
          gezin_id: 1,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er bestaat geen boodschap met id 100',
        details: {
          id: 100,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });
    it('should 404 when gezin does not exist', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          naam: "Choco met brokken",
          winkel: "Colruyt",
          hoeveelheid: "1 pot",
          gezin_id: 100,
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
    it('should 400 when missing naam', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          winkel: "Colruyt",
          hoeveelheid: "1 pot",
          gezin_id: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('naam');
    });
    it('should 400 when missing gezin_id', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          naam: "Choco",
          winkel: "Colruyt",
          hoeveelheid: "1 pot",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('gezin_id')
    });
    
  });
  describe('DELETE /api/boodschappen/:id', () => {
    beforeAll(async () => {
      await getKnex()(tables.gezin).insert(data.gezinnen);
      await getKnex()(tables.boodschap).insert(data.boodschappen[0]);
    });
    afterAll(async () => {
      await knex(tables.gezin)
        .whereIn('id', dataToDelete.gezinnen)
        .delete();
    });
    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing boodschap', async () => {
      const response = await request.delete(`${url}/100`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Geen boodschap met id 100 gevonden',
        details: {
          id: 100,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid boodschap id', async () => {
      const response = await request.delete(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });
})