const supertest = require('supertest');
const createServer = require('../src/createServer');
const { getKnex, tables } = require('../src/data');

const data = 
{ 
  gezinnen: [
    {
      // id:1,
      familienaam: "Lemmens - De Smet",
      straat: "Binnenslag",
      huisnummer: 63,
      postcode: 9920,
      stad: "Lovendegem"
    },
    {
      // id:2,
      familienaam: "Lemmens - Roebroek",
      straat: "Joost Van De Vondelplein",
      huisnummer: 27,
      postcode: 9940,
      stad: "Ertvelde"
    },
]
};
const dataToDelete = {
  gezinnen: [1, 2],
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
    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });
  describe('GET /api/gezinnen/:id', () => {
    beforeAll(async () => {
      await knex(tables.gezin).insert(data.gezinnen[0]);
    });
    afterAll(async () => {
      await knex(tables.gezin)
      .whereIn('id',dataToDelete.gezinnen)
      .delete();
    });

    it('should 200 and return the requested gezin', async () => {
      const response = await request.get(`${url}/1`); 
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
        id:1,
        familienaam: "Lemmens - De Smet",
        straat: "Binnenslag",
        huisnummer: 63,
        postcode: 9920,
        stad: "Lovendegem"
      }]);
    });
    // it('should 404 when requesting not existing gezin', async () => {
    //   const response = await request.get(`${url}/10`);

    //   expect(response.statusCode).toBe(404);
    //   expect(response.body).toMatchObject({
    //     code: 'NOT_FOUND',
    //     message: 'Er bestaat geen gezin met id 10',
    //     details: {
    //       id: 4,
    //     },
    //   });

    //   expect(response.body.stack).toBeTruthy();
    // });
    
    it('should 400 with invalid gezin id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });
  describe('POST /api/gezinnen', () => {
    const gezinnenToDelete=[];

    beforeAll(async () => {
      await knex(tables.gezin).insert(data.gezinnen);
    });

    afterAll(async () => {
      await knex(tables.gezin)
        .whereIn('id', gezinnenToDelete)
        .delete();
    });

    it('should 201 and return the created gezin', async () => {
      const response = await request.post(url)
        .send({
          familienaam: "Pauwels - De Meyer",
          straat: "Kapellestraat",
          huisnummer: 146,
          postcode: 9870,
          stad: "Zulte"
        });

      expect(response.status).toBe(201);
      expect(response.body[0].id).toBeTruthy();
      expect(response.body[0].huisnummer).toBe(146);
      expect(response.body[0].postcode).toBe(9870);
      expect(response.body[0].familienaam).toBe("Pauwels - De Meyer");
      expect(response.body[0].straat).toBe("Kapellestraat");
      expect(response.body[0].stad).toBe("Zulte");

      gezinnenToDelete.push(response.body[0].id);
    }); 

    it('should 400 when missing familienaam', async () => {
      const response = await request.post(url)
        .send({
          straat: "Kapellestraat",
          huisnummer:146,
          postcode: 9870,
          stad: "Zulte"
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('familienaam');
    });

    it('should 400 when missing huisnummer', async () => {
      const response = await request.post(url)
        .send({
          familienaam: "Pauwels - De Meyer",
          straat: "Kapellestraat",
          postcode: 9870,
          stad: "Zulte"
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('huisnummer');
    });

    it('should 400 when missing straat', async () => {
     const response = await request.post(url)
      .send({
        familienaam: "Pauwels - De Meyer",
        huisnummer: 146,
        postcode: 9870,
        stad: "Zulte"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe('VALIDATION_FAILED');
    expect(response.body.details.body).toHaveProperty('straat');
    }); 

    it('should 400 when missing postcode', async () => {
      const response = await request.post(url)
       .send({
         familienaam: "Pauwels - De Meyer",
         huisnummer: 146,
         straat: "Kapellestraat",
         stad: "Zulte"
       });
 
     expect(response.statusCode).toBe(400);
     expect(response.body.code).toBe('VALIDATION_FAILED');
     expect(response.body.details.body).toHaveProperty('postcode');
     }); 

     it('should 400 when missing stad', async () => {
      const response = await request.post(url)
       .send({
         familienaam: "Pauwels - De Meyer",
         huisnummer: 146,
         straat: "Kapellestraat",
         postcode: 9870
     });
 
     expect(response.statusCode).toBe(400);
     expect(response.body.code).toBe('VALIDATION_FAILED');
     expect(response.body.details.body).toHaveProperty('stad');
     }); 
    });
  describe('PUT /api/gezinnen/:id', () => {

    // beforeAll(async () => {
      // await knex(tables.gezin).insert(data.gezinnen);
    // });

    // afterAll(async () => {
    //   await knex(tables.gezin)
    //     .whereIn('id', dataToDelete.gezinnen)
    //     .delete();
    // });

    // it('should 200 and return the updated gezin', async () => {
    //   const response = await request.put(`${url}/1`)
    //     .send({
    //       familienaam: "Pauwels - De Meyer",
    //       straat: "Kapellestraat",
    //       huisnummer: 146,
    //       postcode: 9870,
    //       stad: "Zulte"
    //     });

    //   expect(response.statusCode).toBe(200);
    //   expect(response.body.id).toBeTruthy();
    //   expect(response.body.familienaam).toBe("Pauwels - De Meyer");
    //   expect(response.body.straat).toBe('Kapellestraat');
    //   expect(response.body.huisnummer).toBe(146);
    //   expect(response.body.postcode).toBe(9870);
    //   expect(response.body.stad).toBe('Zulte');
    // });

    // it('should 404 when updating not existing gezin', async () => {
    //   const response = await request.put(`${url}/4`)
    //     .send({
    //       familienaam: "Pauwels - De Meyer",
    //       straat: "Kapellestraat",
    //       huisnummer: 146,
    //       postcode: 9870,
    //       stad: "Zulte"
    //     });

    //   expect(response.statusCode).toBe(404);
    //   expect(response.body).toMatchObject({
    //     code: 'NOT_FOUND',
    //     message: 'Er bestaat geen gezin met id 4',
    //     details: {
    //       id: 4,
    //     },
    //   });
    //   expect(response.body.stack).toBeTruthy();
    // });

    // it('should 400 when missing familienaam', async () => {
    //   const response = await request.put(`${url}/1`)
    //     .send({
    //       straat: "Kapellestraat",
    //       huisnummer: 146,
    //       postcode: 9870,
    //       stad: "Zulte"
    //     });

    //   expect(response.statusCode).toBe(400);
    //   expect(response.body.code).toBe('VALIDATION_FAILED');
    //   expect(response.body.details.body).toHaveProperty('familienaam');
    // });
    // it('should 400 when missing straat', async () => {
    //   const response = await request.put(`${url}/1`)
    //     .send({
    //       familienaam: "Pauwels - De Meyer",
    //       huisnummer: 146,
    //       postcode: 9870,
    //       stad: "Zulte"
    //     });

    //   expect(response.statusCode).toBe(400);
    //   expect(response.body.code).toBe('VALIDATION_FAILED');
    //   expect(response.body.details.body).toHaveProperty('straat');
    // });
    // it('should 400 when missing huisnummer', async () => {
    //   const response = await request.put(`${url}/1`)
    //     .send({
    //       familienaam: "Pauwels - De Meyer",
    //       straat: "Kapellestraat",
    //       postcode: 9870,
    //       stad: "Zulte"
    //     });

    //   expect(response.statusCode).toBe(400);
    //   expect(response.body.code).toBe('VALIDATION_FAILED');
    //   expect(response.body.details.body).toHaveProperty('huisnummer');
    // });
    // it('should 400 when missing postcode', async () => {
    //   const response = await request.put(`${url}/1`)
    //     .send({
    //       familienaam: "Pauwels - De Meyer",
    //       straat: "Kapellestraat",
    //       huisnummer: 146,
    //       stad: "Zulte"
    //     });

    //   expect(response.statusCode).toBe(400);
    //   expect(response.body.code).toBe('VALIDATION_FAILED');
    //   expect(response.body.details.body).toHaveProperty('postcode');
    // });
    // it('should 400 when missing stad', async () => {
    //   const response = await request.put(`${url}/1`)
    //     .send({
    //       familienaam: "Pauwels - De Meyer",
    //       straat: "Kapellestraat",
    //       huisnummer: 146,
    //       postcode: 9870,
    //     });

    //   expect(response.statusCode).toBe(400);
    //   expect(response.body.code).toBe('VALIDATION_FAILED');
    //   expect(response.body.details.body).toHaveProperty('stad');
    // });

  });
  describe('DELETE /api/gezinnen/:id', () => {

    beforeAll(async () => {
      await knex(tables.gezin).insert(data.gezinnen);
     });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing gezin', async () => {
      const response = await request.delete(`${url}/4`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Geen gezin met id 4 gevonden',
        details: {
          id: 4,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid gezin id', async () => {
      const response = await request.delete(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });
});
