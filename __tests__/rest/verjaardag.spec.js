const {withServer, login, loginAdmin} = require('../supertest.setup');
const {testAuthHeader} = require('../common/auth');
const Role = require('../../src/core/roles');

const data = 
{ 
  gezinnen: [

    {
      id:2,
      familienaam: "Lemmens - Roebroek",
      straat: "Joost Van De Vondelplein",
      huisnummer: 27,
      postcode: 9940,
      stad: "Ertvelde"
    },
  ],
  verjaardagen: [
    {
      id: 3,
      dagnummer: 30,
      maandnummer: 12,
      voornaam: "Mikele",
      achternaam: "Lemmens",

    },
    {
      id: 4,
      dagnummer: 24,
      maandnummer: 8,
      voornaam: "Charlotte",
      achternaam: "De Smet",

    },
    {
      id: 5,
      dagnummer: 23,
      maandnummer: 9,
      voornaam: "Ellis",
      achternaam: "Lemmens",
      
    },
    {
      id: 6,
      dagnummer: 30,
      maandnummer: 12,
      voornaam: "Mattia",
      achternaam: "Lemmens",
  
    },
    {
      id: 7,
      dagnummer: 15,
      maandnummer: 12,
      voornaam: "Katrijn",
      achternaam: "Goens",
  
    },
    {
      id: 8,
      dagnummer: 10,
      maandnummer: 11,
      voornaam: "Myrthe",
      achternaam: "Roebroek",
    }
  ],
  gezinsleden: [
    {
      id: 3,
      voornaam: "Mikele",
      email: "mikele.lemmens@hotmail.com",
      wachtwoord: "######",
      gezin_id: 1,
      verjaardag_id: 3,
      roles: JSON.stringify([Role.ADMIN,Role.USER]),

    },
    {
      id: 4,
      voornaam: "Charlotte",
      email: "desmetcharlotte2@gmail.com",
      wachtwoord: "######",
      gezin_id: 1,
      verjaardag_id: 4,
      roles: JSON.stringify([Role.USER]),

    },
    {
      id: 5,
      voornaam: "Ellis",
      email: null,
      wachtwoord: null,
      gezin_id: 1,
      verjaardag_id: 5,
      roles: JSON.stringify([Role.USER]),

    },
    {
      id: 6,
      voornaam: "Mattia",
      email: "Mattia.Lemmens@hotmail.com",
      wachtwoord: "######",
      gezin_id: 2,
      verjaardag_id: 7,
      roles: JSON.stringify([Role.USER]),

    },
    {
      id: 7,
      voornaam: "Myrthe",
      email: "Myrthe.Roebroek@gmail.com",
      wachtwoord: "######",
      gezin_id: 2,
      verjaardag_id:8,
      roles: JSON.stringify([Role.USER]),

    },
  ],
  gezinVerjaardagen:[

    {
      id: 3,
      gezin_id: 1,
      verjaardag_id: 3,
    },
    {
      id: 4,
      gezin_id: 1,
      verjaardag_id: 4,
    },
    {
      id: 5,
      gezin_id: 1,
      verjaardag_id: 5,
    },
    {
      id: 6,
      gezin_id: 2,
      verjaardag_id: 6,
    },
    {
      id: 7,
      gezin_id: 2,
      verjaardag_id: 7,
    },
    {
      id: 8,
      gezin_id: 2,
      verjaardag_id: 8,
    },
    {
      id: 9,
      gezin_id: 1,
      verjaardag_id: 7,
    },
  ],

};
const dataToDelete = {
  // Don't delete instances created in global setup, they only get created once
  gezinnen: [2],
  verjaardagen: [3, 4, 5, 6, 7, 8],
  gezinVerjaardagen: [3, 4, 5, 6, 7, 8, 9],
  gezinsleden: [3, 4, 5, 6, 7],
};

describe('Gezinnen', () => {
  let authHeader;
  let adminAuthHeader;
  let request;
  let sequelize;

  withServer(({
    supertest,
    sequelize: s
  }) => {
    setTimeout(() => console.log,4000);
    request = supertest;
    sequelize = s;
  });

  beforeAll(async () => {
    // authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/gezinnen/1/verjaardagen';

  describe('GET /api/gezinnen/1/verjaardagen', () => {
    beforeAll(async () => {
      await sequelize.models.Gezin.bulkCreate(data.gezinnen);
      await sequelize.models.Verjaardag.bulkCreate(data.verjaardagen);
      await sequelize.models.GezinVerjaardag.bulkCreate(data.gezinVerjaardagen);
      await sequelize.models.Gezinslid.bulkCreate(data.gezinsleden);
    });

    afterAll(async () => {
      await sequelize.models.Gezinslid.destroy({
        where: {
          id: dataToDelete.gezinsleden,
        }
      });
      await sequelize.models.Verjaardag.destroy({
        where: {
          id: dataToDelete.verjaardagen,
        }
      });
      await sequelize.models.Gezin.destroy({
        where: {
          id: dataToDelete.gezinnen,
        }
      });
    });

    it('should 200 and return all verjaardagen', async () => {
      const response = await request.get(url).set('Authorization',adminAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body.verjaardagen.length).toBe(6);

      expect(response.body.verjaardagen[0]).toEqual({
          dagnummer: 1,
          maandnummer: 1,
          voornaam: "Test",
          achternaam: "User",
      });
    });  
    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`).set('Authorization',adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
    testAuthHeader(() => request.get(url))
  });
  describe('GET /api/gezinnen/1/verjaardagen/:id', () => {
    beforeAll(async () => {
      await sequelize.models.Gezin.bulkCreate(data.gezinnen);
      await sequelize.models.Verjaardag.bulkCreate(data.verjaardagen);
      await sequelize.models.GezinVerjaardag.bulkCreate(data.gezinVerjaardagen);
      await sequelize.models.Gezinslid.bulkCreate(data.gezinsleden);
    });

    afterAll(async () => {
      await sequelize.models.Gezinslid.destroy({
        where: {
          id: dataToDelete.gezinsleden,
        }
      });
      await sequelize.models.Verjaardag.destroy({
        where: {
          id: dataToDelete.verjaardagen,
        }
      });
      await sequelize.models.Gezin.destroy({
        where: {
          id: dataToDelete.gezinnen,
        }
      });
    });
    it('should 200 and return the requested verjaardag', async () => {
      const response = await request.get(`${url}/1`).set('Authorization',adminAuthHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ 
        id:1, 
        dagnummer: 1,
        maandnummer: 1,
        voornaam: "Test",
        achternaam: "User",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
    it('should 404 when requesting not existing verjaardag', async () => {
      const response = await request.get(`${url}/100`).set('Authorization',adminAuthHeader);

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

    testAuthHeader(() => request.get(`${url}/1`))
  })
  describe('POST /api/gezinnen/1/verjaardagen', () => {
    const verjaardagenToDelete = [];

    afterAll(async () => {
      await sequelize.models.Verjaardag.destroy({
        where: {
          id: verjaardagenToDelete
        }
      });
    });
    it('should 201 and return the created verjaardag', async () => {
      const response = await request.post(url).set('Authorization',adminAuthHeader)
        .send({
          dagnummer: 3,
          maandnummer: 9,
          voornaam: "Basia",
          achternaam: "Nowak",
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.voornaam).toBe("Basia");
      expect(response.body.achternaam).toBe("Nowak");
      expect(response.body.dagnummer).toBe(3);
      expect(response.body.maandnummer).toBe(9);

      verjaardagenToDelete.push(response.body.id);
    });

    it('should 400 when missing dagnummer', async () => {
      const response = await request.post(url).set('Authorization',adminAuthHeader)
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
      const response = await request.post(url).set('Authorization',adminAuthHeader)
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
      const response = await request.post(url).set('Authorization',adminAuthHeader)
        .send({
          dagnummer: 3,
          maandnummer: 9,
          achternaam: "Nowak",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('voornaam');
    });
    testAuthHeader(() => request.post(url))
  });
  describe('PUT /api/gezinnen/1/verjaardagen', () => {
    beforeAll(async () => {
      await sequelize.models.Verjaardag.create({
        
          id: 3,
          dagnummer: 30,
          maandnummer: 12,
          voornaam: "Mikele",
          achternaam: "Lemmens",
         
      })
    });

    afterAll(async () => {
      await sequelize.models.Verjaardag.destroy({
        where: {
          id: 3
        }
      })
    });
    it('should 200 and return the updated verjaardag', async () => {
      const response = await request.put(`${url}/3`).set('Authorization',adminAuthHeader)
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
      const response = await request.put(`${url}/100`).set('Authorization',adminAuthHeader)
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
      const response = await request.put(`${url}/3`).set('Authorization',adminAuthHeader)
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
      const response = await request.put(`${url}/3`).set('Authorization',adminAuthHeader)
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
      const response = await request.put(`${url}/1`).set('Authorization',adminAuthHeader)
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
      const response = await request.put(`${url}/3`).set('Authorization',adminAuthHeader)
        .send({
          dagnummer: 3,
          maandnummer: 9,
          voornaam: "Basia",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('achternaam');
    });
    testAuthHeader(()=>request.put(`${url}/1`))
  });
  describe('DELETE /api/verjaardagen', () => {
   
    beforeAll(async () => {
      await sequelize.models.Verjaardag.create({
        
          id: 3,
          dagnummer: 30,
          maandnummer: 12,
          voornaam: "Mikele",
          achternaam: "Lemmens",
         
      })
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/3`).set('Authorization',adminAuthHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });
    it('should 404 with not existing verjaardag', async () => {
      const response = await request.delete(`${url}/100`).set('Authorization',adminAuthHeader);

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
    it('should 400 with invalid verjaardag id', async () => {
      const response = await request.delete(`${url}/invalid`).set('Authorization',adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('verjaardag_id');
    });

    testAuthHeader(() => request.delete(`${url}/3`))
  });
})
