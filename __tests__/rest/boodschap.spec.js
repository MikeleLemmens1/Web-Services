const {withServer, login, loginAdmin} = require('../supertest.setup');
const {testAuthHeader} = require('../common/auth');

const data = {
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
      gezin_id: 2
    }
  ],
};

const dataToDelete = {
  gezinnen: [2],
  boodschappen: [1, 2, 3, 4, 5]
};

describe('Boodschappen', () => {
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

  const url = '/api/gezinnen/1/boodschappen';

  describe('GET /api/gezinnen/1/boodschappen', () => {
    beforeAll(async () => {
      await sequelize.models.Gezin.bulkCreate(data.gezinnen);
      await sequelize.models.Boodschap.bulkCreate(data.boodschappen);
    });
    afterAll(async () => {
      await sequelize.models.Boodschap.destroy({
        where: {
          id: dataToDelete.boodschappen,
        },
      });
      await sequelize.models.Gezin.destroy({
        where: {
          id: dataToDelete.gezinnen,
        },
      });
    });
    it('should 200 and return all boodschappen for the gezin', async () => {
      const response = await request.get(url).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body.boodschappen.length).toBe(4);

      expect(response.body.boodschappen[0]).toEqual({
        id: 1,
        naam: "Choco",
        winkel: "Colruyt",
        hoeveelheid: "1 pot",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        gezin_id: 1,
      });
    });
    it('should 200 and return all boodschappen by winkel for the gezin', async () => {
      const response = await request.get(`${url}?winkel=Colruyt`).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body.boodschappen.length).toBe(2);

      expect(response.body.boodschappen[0]).toEqual({
        id: 1,
        naam: "Choco",
        winkel: "Colruyt",
        hoeveelheid: "1 pot",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        gezin_id: 1,
      });
    });

    testAuthHeader(() => request.get(url))

  });
  describe('GET /api/boodschappen/:id', () => {
    beforeAll(async () => {
      await sequelize.models.Gezin.bulkCreate(data.gezinnen);
      await sequelize.models.Boodschap.bulkCreate(data.boodschappen);
    });
    afterAll(async () => {
      await sequelize.models.Boodschap.destroy({
        where: {
          id: dataToDelete.boodschappen,
        },
      });
      await sequelize.models.Gezin.destroy({
        where: {
          id: dataToDelete.gezinnen,
        },
      });
    });
    it('should 200 and return requested boodschap', async () => {
      const response = await request.get(`${url}/1`).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        naam: "Choco",
        winkel: "Colruyt",
        hoeveelheid: "1 pot",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        gezin_id: 1,
      });
    });
    it('should 404 when requesting not existing boodschap', async () => {
      const response = await request.get(`${url}/7`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er bestaat geen boodschap met id 7',
        details: {
          id: 7,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid boodschap id', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('boodschap_id');
    });
    testAuthHeader(()=>request.get(`${url}/1`))
  });
  describe('POST /api/boodschappen/', () => {
    const boodschappenToDelete = [];

    afterAll(async () => {
      await sequelize.models.Boodschap.destroy({
        where: {
          id: boodschappenToDelete,
        }
      });
    });

    it('should 201 and return the created boodschap', async () => {
      const response = await request.post(url).set('Authorization', adminAuthHeader)
        .send({
          naam: "Choco",
          winkel: "Colruyt",
          hoeveelheid: "1 pot",
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.naam).toBe("Choco");
      expect(response.body.winkel).toBe("Colruyt");
      expect(response.body.hoeveelheid).toBe("1 pot");
      boodschappenToDelete.push(response.body.id);
     
    });
        
    it('should 400 when missing naam', async () => {
      const response = await request.post(url).set('Authorization', adminAuthHeader)
        .send({
          winkel: "Colruyt",
          hoeveelheid: "1 pot",
       });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('naam');
    });
    testAuthHeader(() => request.post(url))

  });
  describe('PUT /api/boodschappen/:id', () => {
    beforeAll(async () => {
      await sequelize.models.Boodschap.create({
        id: 1,
        naam: "Choco",
        winkel: "Colruyt",
        hoeveelheid: "1 pot",
        gezin_id:1
      });
    });
    afterAll(async () => {
      await sequelize.models.Boodschap.destroy({
        where: {
          id: 1,
        }
      });
    });

    it('should 200 and return the updated boodschap', async () => {
      const response = await request.put(`${url}/1`).set('Authorization', adminAuthHeader)
        .send({
          naam: "Choco met brokken",
          winkel: "Colruyt",
          hoeveelheid: "1 pot",
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.naam).toBe("Choco met brokken");
      expect(response.body.hoeveelheid).toBe("1 pot");
    });

    it('should 404 when updating not existing boodschap', async () => {
      const response = await request.put(`${url}/100`).set('Authorization', adminAuthHeader)
        .send({
          naam: "Choco met brokken",
          winkel: "Colruyt",
          hoeveelheid: "1 pot",
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

    it('should 400 when missing naam', async () => {
      const response = await request.put(`${url}/1`).set('Authorization', adminAuthHeader)
        .send({
          winkel: "Colruyt",
          hoeveelheid: "1 pot",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('naam');
    });
    testAuthHeader(() => request.put(`${url}/1`))
    
  });
  describe('DELETE /api/boodschappen/:id', () => {
    beforeAll(async () => {
      await sequelize.models.Boodschap.create({
        id: 1,
        naam: "Choco",
        winkel: "Colruyt",
        hoeveelheid: "1 pot",
        gezin_id:1
      });
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing boodschap', async () => {
      const response = await request.delete(`${url}/100`).set('Authorization', adminAuthHeader);

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

    it('should 400 with invalid boodschap id', async () => {
      const response = await request.delete(`${url}/invalid`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('boodschap_id');
    });
    testAuthHeader(() => request.delete(`${url}/1`))
  });
})