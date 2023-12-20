const supertest = require('supertest');
const createServer = require('../../src/createServer');
const { tables, getKnex } = require('../../src/data');

const data = {
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
    
],
kalender: [      {
  id:1,
  gezin_id: 1,
  verjaardag_id: 1
},
{ 
  id:2,
  gezin_id: 1,
  verjaardag_id: 2
},
{ 
  id:3,
  gezin_id: 1,
  verjaardag_id: 3
},
{ 
  id:4,
  gezin_id: 1,
  verjaardag_id: 4
},
{ 
  id:5,
  gezin_id: 1,
  verjaardag_id: 5
},
{ 
  id:6,
  gezin_id: 1,
  verjaardag_id: 6
}],

};

const dataToDelete = {
  gezinnen: [1],
  kalender: [1, 2, 3, 4, 5, 6],
  verjaardagen: [1, 2, 3, 4, 5, 6]
}

describe('Verjaardagen', () => {
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

  const url = '/api/verjaardagen';

  describe('GET /api/verjaardagen', () => {
    beforeAll(async () => {
      await knex(tables.gezin).insert(data.gezinnen)
      await knex(tables.verjaardag).insert(data.verjaardagen);
      await knex(tables.kalender).insert(data.kalender)
    });

    afterAll(async () => {
      await knex(tables.gezin)
        .whereIn('id', dataToDelete.gezinnen)
        .delete();
      await knex(tables.verjaardag)
        .whereIn('id', dataToDelete.verjaardagen)
        .delete();
      await knex(tables.kalender)
        .whereIn('id', dataToDelete.kalender)
        .delete();
    });

    it('should 200 and return all verjaardagen', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(6);

      expect(response.body.items[0]).toEqual({
          id: 2,
          dagnummer: 24,
          maandnummer: 8,
          voornaam: "Charlotte",
          achternaam: "De Smet",
      });
    });  
    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });
  describe('GET /api/verjaardagen/:id', () => {
    beforeAll(async () => {
      await knex(tables.gezin).insert(data.gezinnen)
      await knex(tables.verjaardag).insert(data.verjaardagen);
      await knex(tables.kalender).insert(data.kalender)
    });

    afterAll(async () => {
      await knex(tables.gezin)
        .whereIn('id', dataToDelete.gezinnen)
        .delete();
      await knex(tables.verjaardag)
        .whereIn('id', dataToDelete.verjaardagen)
        .delete();
      await knex(tables.kalender)
        .whereIn('id', dataToDelete.kalender)
        .delete();
    });
    it('should 200 and return the requested verjaardag', async () => {
      const response = await request.get(`${url}/2`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ 
        id: 2,
        dagnummer: 24,
        maandnummer: 8,
        voornaam: "Charlotte",
        achternaam: "De Smet",
      });
    });
    it('should 404 when requesting not existing verjaardag', async () => {
      const response = await request.get(`${url}/7`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er bestaat geen verjaardag met id 7',
        details: {
          id: 7,
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
  })
  describe('POST /api/verjaardagen', () => {
    const verjaardagenToDelete = [];

    beforeAll(async () => {
      await knex(tables.gezin).insert(data.gezinnen);
      // await knex(tables.kalender).insert(data.kalender);
    });

    afterAll(async () => {
      await knex(tables.kalender)
        .whereIn('id', dataToDelete.kalender)
        .delete();

      await knex(tables.verjaardag)
        .whereIn('id', verjaardagenToDelete)
        .delete();

      await knex(tables.gezin)
        .whereIn('id', dataToDelete.gezinnen)
        .delete();
    });
    it('should 201 and return the created verjaardag', async () => {
      const response = await request.post(url)
        .send({
          dagnummer: 3,
          maandnummer: 9,
          voornaam: "Basia",
          achternaam: "Nowak",
          gezin_id: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.voornaam).toBe("Basia");
      expect(response.body.achternaam).toBe("Nowak");
      expect(response.body.dagnummer).toBe(3);
      expect(response.body.maandnummer).toBe(9);

      verjaardagenToDelete.push(response.body.id);
    });
    it('should 404 when gezin does not exist', async () => {
      const response = await request.post(url)
        .send({
          dagnummer: 3,
          maandnummer: 9,
          voornaam: "Basia",
          achternaam: "Nowak",
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
    it('should 400 when missing dagnummer', async () => {
      const response = await request.post(url)
        .send({
          maandnummer: 9,
          voornaam: "Basia",
          achternaam: "Nowak",
          gezin_id: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('dagnummer');
    });
    it('should 400 when missing maandnummer', async () => {
      const response = await request.post(url)
        .send({
          dagnummer: 3,
          voornaam: "Basia",
          achternaam: "Nowak",
          gezin_id: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('maandnummer');
    });
    it('should 400 when missing voornaam', async () => {
      const response = await request.post(url)
        .send({
          dagnummer: 3,
          maandnummer: 9,
          achternaam: "Nowak",
          gezin_id: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('voornaam');
    });
    it('should 400 when missing achternaam', async () => {
      const response = await request.post(url)
        .send({
          dagnummer: 3,
          maandnummer: 9,
          voornaam: "Basia",
          gezin_id: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('achternaam');
    });
    it('should 400 when missing gezin_id', async () => {
      const response = await request.post(url)
        .send({
          dagnummer: 3,
          maandnummer: 9,
          voornaam: "Basia",
          achternaam: "Nowak",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('gezin_id');
    });

  });
  describe('PUT /api/verjaardagen', () => {
    beforeAll(async () => {
      await knex(tables.gezin).insert(data.gezinnen)
      await knex(tables.verjaardag).insert(data.verjaardagen);
      await knex(tables.kalender).insert(data.kalender)
    });

    afterAll(async () => {
      await knex(tables.gezin)
        .whereIn('id', dataToDelete.gezinnen)
        .delete();
      await knex(tables.verjaardag)
        .whereIn('id', dataToDelete.verjaardagen)
        .delete();
      await knex(tables.kalender)
        .whereIn('id', dataToDelete.kalender)
        .delete();
    });

    it('should 200 and return the updated verjaardag', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          dagnummer: 4,
          maandnummer: 9,
          voornaam: "Basia",
          achternaam: "Nowak",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.dagnummer).toBe(4);
      expect(response.body.maandnummer).toBe(9);
      expect(response.body.voornaam).toBe("Basia");
      expect(response.body.achternaam).toBe("Nowak");
    });
    it('should 404 when updating not existing verjaardag', async () => {
      const response = await request.put(`${url}/100`)
        .send({
          dagnummer: 4,
          maandnummer: 9,
          voornaam: "Basia",
          achternaam: "Nowak",
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
    it('should 400 when missing dagnummer', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          maandnummer: 9,
          voornaam: "Basia",
          achternaam: "Nowak",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('dagnummer');
    });
    it('should 400 when missing maandnummer', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          dagnummer: 3,
          voornaam: "Basia",
          achternaam: "Nowak",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('maandnummer');
    });
    it('should 400 when missing voornaam', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          dagnummer: 3,
          maandnummer: 9,
          achternaam: "Nowak",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('voornaam');
    });
    it('should 400 when missing achternaam', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          dagnummer: 3,
          maandnummer: 9,
          voornaam: "Basia",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('achternaam');
    });
  });
  describe('DELETE /api/verjaardagen', () => {
   
    beforeAll(async () => {
      await knex(tables.gezin).insert(data.gezinnen)
      await knex(tables.verjaardag).insert(data.verjaardagen[0]);
      await knex(tables.kalender).insert(data.kalender[0])
    });

    afterAll(async () => {
      await knex(tables.gezin)
        .whereIn('id', dataToDelete.gezinnen)
        .delete();
      await knex(tables.verjaardag)
        .whereIn('id', dataToDelete.verjaardagen)
        .delete();
      await knex(tables.kalender)
        .whereIn('id', dataToDelete.kalender)
        .delete();
    }); 

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });
    it('should 404 with not existing verjaardag', async () => {
      const response = await request.delete(`${url}/100`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Geen verjaardag met id 100 gevonden',
        details: {
          id: 100,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });
    it('should 400 with invalid verjaardag id', async () => {
      const response = await request.delete(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });


  });
})
