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
      verjaardag_id: 1,
      roles: JSON.stringify([Role.ADMIN,Role.USER]),

    },
    {
      id: 4,
      voornaam: "Charlotte",
      email: "desmetcharlotte2@gmail.com",
      wachtwoord: "######",
      gezin_id: 1,
      verjaardag_id: 1,
      roles: JSON.stringify([Role.USER]),

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
    {
      id: 3,
      naam: "Louie wandelen",
      dag: "2023-10-18",
      gezinslid_id: 2,
    },
    {
      id: 4,
      naam: "Eten maken",
      dag: "2023-10-19",
      gezinslid_id: 2,
    },
    {
      id: 5,
      naam: "Eten maken",
      dag: "2023-10-16",
      gezinslid_id: 2,
    },
  ]
};

const dataToDelete = {
  gezinsleden: [3, 4],
  geplande_taken: [1, 2, 3, 4 ,5]
};
describe('Geplande Taken', () => {
  let authHeader;
  let adminAuthHeader;
  let request;
  let sequelize;

  withServer(({
    supertest,
    sequelize: s
  }) => {
    // setTimeout(() => console.log,4000);
    request = supertest;
    sequelize = s;
  });

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/gezinsleden/1/geplande_taken';

  describe('GET /api/geplande_taken', () => {
    beforeAll(async () => {
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
    });
    it('should 200 and return all geplande taken for the gezinslid', async () => {
      const response = await request.get(url).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body.geplandeTaken.length).toBe(2);

      expect(response.body.geplandeTaken[0]).toEqual({
          id: 1,
          naam: "Ellis halen",
          dag: "2023-10-16",
          gezinslid_id: 1,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
      });
    });
    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });

    testAuthHeader(() => request.get(url));
  });
  describe('GET /api/geplande_taken/:id', () => {
    beforeAll(async () => {
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
    });
    it('should 200 and return the requested geplande taak', async () => {
      const response = await request.get(`${url}/1`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        {    
          id: 1,
          naam: "Ellis halen",
          dag: "2023-10-16",
          gezinslid_id: 1,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
           
        }
      );
    });
    it('should 404 when requesting not existing geplande taak', async () => {
      const response = await request.get(`${url}/6`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er bestaat geen geplande taak met id 6',
        details: {
          id: 6,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid geplande taak id', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('taak_id');
    });
    testAuthHeader(() => request.get(`${url}/1`))

  });
  describe('POST /api/geplande_taken', () => {
    const geplandeTakenToDelete = [];

    afterAll( async () => {
      sequelize.models.GeplandeTaak.destroy({
        where: {
          id: geplandeTakenToDelete
        }
      })
    });

    it('should 201 and return the created geplande taak', async () => {
      const response = await request.post(url).set('Authorization', adminAuthHeader)
        .send({
          naam: "Ellis halen",
          dag: "2023-10-17",
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.naam).toBe("Ellis halen");
      expect(response.body.dag).toBe("2023-10-17");
      expect(response.body.gezinslid_id).toBe(1);

      geplandeTakenToDelete.push(response.body.id);
    });

    it('should 400 when missing naam', async () => {
      const response = await request.post(url).set('Authorization', adminAuthHeader)
        .send({
          dag: "2023-10-16",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('naam');
    });
    it('should 400 when missing dag', async () => {
      const response = await request.post(url).set('Authorization', adminAuthHeader)
        .send({
          naam: "Ellis halen",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('dag');
    });
    testAuthHeader(() => request.post(url))
  });
  describe('PUT /api/geplande_taken', () => {
    beforeAll( async () => {
      await sequelize.models.GeplandeTaak.create({
        
          id: 1,
          naam: "Ellis halen",
          dag: "2023-10-16",
          gezinslid_id: 1,
        
      })
    });
    afterAll(async () => {
      await sequelize.models.GeplandeTaak.destroy({
        where: {
          id: 1
        }
      })
    });
    it('should 200 and return the updated geplande taak', async () => {
      const response = await request.put(`${url}/1`).set('Authorization', adminAuthHeader)
        .send({
          naam: "Ellis niet meer halen",
          dag: "2023-10-16",
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.naam).toBe("Ellis niet meer halen");
      expect(response.body.dag).toBe("2023-10-16");

    });
    it('should 404 when updating not existing geplande taak', async () => {
      const response = await request.put(`${url}/100`).set('Authorization', adminAuthHeader)
        .send({
          naam: "Ellis niet meer halen",
          dag: "2023-10-16",
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
    testAuthHeader(() => request.put(`${url}/1`))
  });
  describe('DELETE /api/geplande_taken', () => {
    beforeAll(async () => {
      await sequelize.models.GeplandeTaak.create({
        
        id: 1,
        naam: "Ellis halen",
        dag: "2023-10-16",
        gezinslid_id: 1,
      
    })
    });
   
    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });
    it('should 404 with not existing geplande taak', async () => {
      const response = await request.delete(`${url}/100`).set('Authorization', adminAuthHeader);

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

    it('should 400 with invalid geplande taak id', async () => {
      const response = await request.delete(`${url}/invalid`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('taak_id');
    });
    testAuthHeader(() => request.delete(`${url}/1`))
  })

})