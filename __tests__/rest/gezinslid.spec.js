const {withServer, login, loginAdmin} = require('../supertest.setup');
const {testAuthHeader} = require('../common/auth');
const Role = require('../../src/core/roles');


const data = {
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
      verjaardag_id: 6,
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
  geplande_taken:[
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
  ]
};

const dataToDelete = {
  gezinnen: [2],
  verjaardagen: [3, 4, 5, 6, 7, 8],
  gezinVerjaardagen: [3, 4, 5, 6, 7, 8, 9],

  gezinsleden: [3, 4, 5, 6, 7],
  geplande_taken: [1, 2]
};

describe('Gezinsleden', () => {
  let sequelize;
  let request;
  let adminAuthHeader;
  let authHeader;

  withServer(({
    supertest,
    sequelize: s

  }) => {
    request = supertest;
    sequelize = s;
  });

  beforeAll(async () => {

    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/gezinsleden';

  describe('GET /api/gezinsleden', () => {

    beforeAll(async () => {
      await sequelize.models.Gezin.bulkCreate(data.gezinnen);
      await sequelize.models.Verjaardag.bulkCreate(data.verjaardagen);
      await sequelize.models.GezinVerjaardag.bulkCreate(data.gezinVerjaardagen);
      await sequelize.models.Gezinslid.bulkCreate(data.gezinsleden);
      await sequelize.models.GeplandeTaak.bulkCreate(data.geplande_taken);
    });

    afterAll(async () => {
      await sequelize.models.GeplandeTaak.destroy({
        where: {
          id: dataToDelete.geplande_taken,
        },
      });
      await sequelize.models.Gezinslid.destroy({
        where: {
          id: dataToDelete.gezinsleden,
        }
      });
      // await sequelize.models.GezinVerjaardag.destroy({
      //   where: {
      //     id: dataToDelete.gezinVerjaardagen,
      //     // id: 1,
      //   }
      // });
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

    it('should 200 and return all gezinsleden', async () => {
      // Only an admin can get all gezinsleden
      const response = await request.get(url).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(7);

      expect(response.body.items[0]).toEqual({
        
          id: 1,
          voornaam: "testuser",
          email: "test.user@gmail.com",
          wachtwoord: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
          roles: "[\"user\"]",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          GeplandeTaken: [
            {
              naam: "Ellis halen",
              dag: "2023-10-17",
            },
            {
              naam: "Ellis halen",
              dag: "2023-10-16",
            },
          ],
          Verjaardag: {
            dagnummer: 1,
            maandnummer: 1,
          },
          Gezin: {
            id: 1,
            familienaam: "Lemmens - De Smet",
          },
        
      });

    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`).set('Authorization',adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });

    testAuthHeader(() => request.get(url));

  });

  describe('GET /api/gezinsleden/:id', () => {

    beforeAll(async () => {
      await sequelize.models.Gezin.bulkCreate(data.gezinnen);
      await sequelize.models.Verjaardag.bulkCreate(data.verjaardagen);
      await sequelize.models.GezinVerjaardag.bulkCreate(data.gezinVerjaardagen);
      await sequelize.models.Gezinslid.bulkCreate(data.gezinsleden);
      await sequelize.models.GeplandeTaak.bulkCreate(data.geplande_taken);
    });

    afterAll(async () => {
      await sequelize.models.GeplandeTaak.destroy({
        where: {
          id: dataToDelete.geplande_taken,
        },
      });
      await sequelize.models.Gezinslid.destroy({
        where: {
          id: dataToDelete.gezinsleden,
        }
      });
      // await sequelize.models.GezinVerjaardag.destroy({
      //   where: {
      //     id: dataToDelete.gezinVerjaardagen,
      //     // id: 1,
      //   }
      // });
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

    it('should 200 and return the requested gezinslid', async () => {
      const response = await request.get(`${url}/1`).set('Authorization',authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
          id: 1,
          voornaam: "testuser",
          email: "test.user@gmail.com",
          wachtwoord: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
          roles: "[\"user\"]",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          GeplandeTaken: [
            {
              naam: "Ellis halen",
              dag: "2023-10-16",
            },
            {
              naam: "Ellis halen",
              dag: "2023-10-17",
            },
          ],
          Verjaardag: {
            dagnummer: 1,
            maandnummer: 1,
          },
          Gezin: {
            id: 1,
            familienaam: "Lemmens - De Smet",
          },
        
      });

    });

    it('should 404 when requesting not existing gezinslid', async () => {
      const response = await request.get(`${url}/10`).set('Authorization',adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er bestaat geen gezinslid met id 10',
        details: {
          id: 10,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid gezinslid id', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization',adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 403 when the request is for another gezin', async () => {
      const response = await request.get('/api/gezinsleden/6').set('Authorization', authHeader
      );

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: "You are not allowed to operate on this family's information.",
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.get(`${url}/1`));

  });

  describe('POST /api/gezinsleden', () => {
    const gezinsledenToDelete = [];

    afterAll(async () => {

      await sequelize.models.Gezinslid.destroy({
        where: {
          id: gezinsledenToDelete,
        }
      });
    });

    it('should 200 and return the registered gezinslid', async () => {
      const response = await request.post(`${url}/register`)
        .send({
          voornaam: 'Louie',
          email: "Louie.lemmens@gmail.com",
          wachtwoord: "12345678",
          dagnummer: 15,
          maandnummer: 4,
          gezin_id:1
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeTruthy();
      expect(response.body.gezinslid.email).toBe("Louie.lemmens@gmail.com");
      expect(response.body.gezinslid.id).toBeTruthy();
      expect(response.body.gezinslid.voornaam).toBe("Louie");


      gezinsledenToDelete.push(response.body.gezinslid.id);
    });

    it('should 200 and return the logged in gezinslid', async () => {
      const response = await request.post(`${url}/login`)
        .send({
          email: "test.user@gmail.com",
          wachtwoord: "12345678",

        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeTruthy();
      expect(response.body.gezinslid.email).toBe("test.user@gmail.com");
      expect(response.body.gezinslid.id).toBeTruthy();
      expect(response.body.gezinslid.voornaam).toBe("testuser");


      gezinsledenToDelete.push(response.body.gezinslid.id);
    });

    it('should 201 and return the created gezinslid', async () => {
      const response = await request.post(url).set('Authorization',adminAuthHeader)
        .send({
          voornaam: "Louie",
          email: "test",
          gezin_id: 1,
          verjaardag_id:1
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.voornaam).toBe("Louie");
      expect(response.body.email).toBe("test");
      expect(response.body.Verjaardag).toEqual(
        {
        dagnummer: 1,
        maandnummer: 1,
        }
      );
      expect(response.body.Gezin).toEqual({
        id: 1,
        familienaam: "Lemmens - De Smet",
      });

      gezinsledenToDelete.push(response.body.id);
    });

    it('should 404 when verjaardag does not exist', async () => {
      const response = await request.post(url).set('Authorization',adminAuthHeader)
        .send({
          voornaam: "Louie",
          email: "test",
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
      const response = await request.post(url).set('Authorization',adminAuthHeader)
        .send({
          email: "",
          gezin_id: 1,
          verjaardag_id:6
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('voornaam');
    });

    testAuthHeader(()=>request.post(`${url}`))
  });

  describe('PUT /api/gezinsleden/:id', () => {

    beforeAll(async () => {
      await sequelize.models.Gezinslid.create( 
        {
          id: 3,
          voornaam: "Louie",
          email: "Louie.lemmens@hotmail.com",
          wachtwoord: "######",
          gezin_id: 1,
          verjaardag_id: 1,
          roles: JSON.stringify([Role.USER]),
        }
  
      );
    });
    afterAll(async()=> {
      await sequelize.models.Gezinslid.destroy({
        where: {
          id: 3,
        }
      });
    });

    it('should 200 and return the updated gezinslid', async () => {
      const response = await request.put(`${url}/3`).set('Authorization',adminAuthHeader)
        .send({
          voornaam: "Louie",
          email: "Louie.lemmens@hotmail.com",
          gezin_id:1,
          verjaardag_id:2
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.voornaam).toBe("Louie");
      expect(response.body.email).toBe("Louie.lemmens@hotmail.com");
      expect(response.body.Gezin).toEqual({
        id: 1,
        familienaam: "Lemmens - De Smet",
      });
      expect(response.body.Verjaardag).toEqual({
        dagnummer: 2,
        maandnummer: 2
      });
    });

    it('should 404 when updating not existing gezinslid', async () => {
      const response = await request.put(`${url}/100`).set('Authorization',adminAuthHeader)
        .send({
          voornaam: "Mikele",
          email: "mikele.lemmens@hotmail.com",
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
      const response = await request.put(`${url}/3`).set('Authorization',adminAuthHeader)
        .send({
          voornaam: "Mikele",
          email: "mikele.lemmens@hotmail.com",
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
      const response = await request.put(`${url}/3`).set('Authorization',adminAuthHeader)
        .send({
          email: "mikele.lemmens@hotmail.com",
          gezin_id:1,
          verjaardag_id:1
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('voornaam');
    });
    it('should 400 when missing gezin_id', async () => {
      const response = await request.put(`${url}/3`).set('Authorization',adminAuthHeader)
        .send({
          email: "mikele.lemmens@hotmail.com",
          voornaam: "Mikele",
          verjaardag_id:1
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('gezin_id');
    });
    it('should 400 when missing verjaardag_id', async () => {
      const response = await request.put(`${url}/3`).set('Authorization',adminAuthHeader)
        .send({
          email: "mikele.lemmens@hotmail.com",
          voornaam: "Mikele",
          gezin_id:1
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('verjaardag_id');
    });

    testAuthHeader(() => request.put(`${url}/3`))

  });

  describe('DELETE /api/gezinsleden/:id', () => {

    beforeAll(async () => {
      await sequelize.models.Gezinslid.create( 
        {
          id: 3,
          voornaam: "Louie",
          email: "Louie.lemmens@hotmail.com",
          wachtwoord: "######",
          gezin_id: 1,
          verjaardag_id: 1,
          roles: JSON.stringify([Role.USER]),
        }
  
      );
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/3`).set('Authorization',adminAuthHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing gezinslid', async () => {
      const response = await request.delete(`${url}/100`).set('Authorization',adminAuthHeader);

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
      const response = await request.delete(`${url}/invalid`).set('Authorization',adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.delete(`${url}/3`))

  });
});