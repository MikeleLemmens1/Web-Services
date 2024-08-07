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
    geplande_taken:[
      {
        id: 1,
        naam: "Ellis halen",
        dag: "2023-10-16",
        gezinslid_id: 3,
      },
      {
        id: 2,
        naam: "Ellis halen",
        dag: "2023-10-17",
        gezinslid_id: 3,
      },
    ]
};
const dataToDelete = {
  boodschappen: [1, 2, 3, 4, 5],
  // Don't delete instances created in global setup, they only get created once
  gezinnen: [2],
  verjaardagen: [3, 4, 5, 6, 7, 8],
  gezinVerjaardagen: [3, 4, 5, 6, 7, 8, 9],
  gezinsleden: [3, 4, 5, 6, 7],
  geplande_taken: [1, 2]

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
    request = supertest;
    sequelize = s;
  });

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/gezinnen';

  describe('GET /api/gezinnen', () => {
    beforeAll(async () => {

      await sequelize.models.Gezin.bulkCreate(data.gezinnen);
      await sequelize.models.Verjaardag.bulkCreate(data.verjaardagen);
      await sequelize.models.GezinVerjaardag.bulkCreate(data.gezinVerjaardagen);
      await sequelize.models.Gezinslid.bulkCreate(data.gezinsleden);
      await sequelize.models.Boodschap.bulkCreate(data.boodschappen);
    });
    afterAll(async () => {

      await sequelize.models.Boodschap.destroy({
        where: {
          id: dataToDelete.boodschappen,
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

    it('should 200 and return all gezinnen', async () => {
      const response = await request.get(url).set('Authorization', authHeader); 
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(2);
      expect(response.body.items).toEqual(
      [
        {
            "id": 1,
            "familienaam": "Lemmens - De Smet",
            "straat": "Binnenslag",
            "huisnummer": 63,
            "postcode": 9920,
            "stad": "Lovendegem",
            "createdAt": expect.any(String),
            "updatedAt": expect.any(String),
            "Gezinsleden": [
                {
                    "email": "test.user@gmail.com",
                    "voornaam": "testuser",
                },
                {
                    "voornaam": "testadmin",
                    "email": "test.admin@gmail.com"
                },
                {
                  "voornaam": "Mikele",
                  "email": "mikele.lemmens@hotmail.com"
                },
                {
                    "voornaam": "Charlotte",
                    "email": "desmetcharlotte2@gmail.com"
                },
                {
                  "voornaam": "Ellis",
                  "email": null
                },

            ],
            "Boodschappen": [
                {
                    "naam": "Choco",
                    "winkel": "Colruyt"
                },
                {
                  "naam": "Hondenbrokken",
                  "winkel": null
                },
                {
                    "naam": "Kaas",
                    "winkel": "Colruyt"
                },

                {
                    "naam": "Pampers",
                    "winkel": "Kruidvat"
                }
            ],
            "Verjaardagen": [
                {
                  "id": 1,
                  "voornaam": "Test",
                  "achternaam": "User",
                  "dagnummer": 1,
                  "maandnummer": 1,
                  "createdAt": expect.any(String),
                  "updatedAt": expect.any(String)
                },
                {
                  "id": 2,
                  "voornaam": "Test",
                  "achternaam": "Admin",
                  "dagnummer": 2,
                  "maandnummer": 2,
                  "createdAt": expect.any(String),
                  "updatedAt": expect.any(String)
                },
                {
                    "id": 3,
                    "voornaam": "Mikele",
                    "achternaam": "Lemmens",
                    "dagnummer": 30,
                    "maandnummer": 12,
                    "createdAt": expect.any(String),
                    "updatedAt": expect.any(String)
                },
                {
                    "id": 4,
                    "voornaam": "Charlotte",
                    "achternaam": "De Smet",
                    "dagnummer": 24,
                    "maandnummer": 8,
                    "createdAt": expect.any(String),
                    "updatedAt": expect.any(String)
                },
                {
                    "id": 5,
                    "voornaam": "Ellis",
                    "achternaam": "Lemmens",
                    "dagnummer": 23,
                    "maandnummer": 9,
                    "createdAt": expect.any(String),
                    "updatedAt": expect.any(String)
                },
                {
                    "id": 7,
                    "voornaam": "Katrijn",
                    "achternaam": "Goens",
                    "dagnummer": 15,
                    "maandnummer": 12,
                    "createdAt": expect.any(String),
                    "updatedAt": expect.any(String)
                }
            ]
        },
        {
            "id": 2,
            "familienaam": "Lemmens - Roebroek",
            "straat": "Joost Van De Vondelplein",
            "huisnummer": 27,
            "postcode": 9940,
            "stad": "Ertvelde",
            "createdAt": expect.any(String),
            "updatedAt": expect.any(String),
            "Gezinsleden": [

                {
                    "voornaam": "Mattia",
                    "email": "Mattia.Lemmens@hotmail.com"
                },
                {
                  "voornaam": "Myrthe",
                  "email": "Myrthe.Roebroek@gmail.com"
                },
            ],
            "Boodschappen": [
                {
                    "naam": "Pampers",
                    "winkel": "Kruidvat"
                }
            ],
            "Verjaardagen": [
                {
                    "id": 6,
                    "voornaam": "Mattia",
                    "achternaam": "Lemmens",
                    "dagnummer": 30,
                    "maandnummer": 12,
                    "createdAt": expect.any(String),
                    "updatedAt": expect.any(String)
                },
                {
                  "id": 7,
                  "voornaam": "Katrijn",
                  "achternaam": "Goens",
                  "dagnummer": 15,
                  "maandnummer": 12,
                  "createdAt": expect.any(String),
                  "updatedAt": expect.any(String)
              },

                {
                    "id": 8,
                    "voornaam": "Myrthe",
                    "achternaam": "Roebroek",
                    "dagnummer": 10,
                    "maandnummer": 11,
                    "createdAt": expect.any(String),
                    "updatedAt": expect.any(String)
                }
            ]
        }
      ]);
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
    it('should 200 and return the requested gezin by familienaam', async () => {
      const response = await request.get(`${url}?familienaam=Lemmens - De Smet`).set('Authorization', authHeader);
      ; 
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        {
          id: 1,
          familienaam: "Lemmens - De Smet",
          straat: "Binnenslag",
          huisnummer: 63,
          postcode: 9920,
          stad: "Lovendegem",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          Gezinsleden: [
            {
              voornaam: "testuser",
              email: "test.user@gmail.com",
            },
            {
              voornaam: "testadmin",
              email: "test.admin@gmail.com",
            },
            {
              voornaam: "Mikele",
              email: "mikele.lemmens@hotmail.com",
            },
            {
              voornaam: "Charlotte",
              email: "desmetcharlotte2@gmail.com",
            },
            {
              voornaam: "Ellis",
              email: null,
            },
          ],
          Boodschappen: [
            {
              naam: "Choco",
              winkel: "Colruyt",
            },
            {
              naam: "Hondenbrokken",
              winkel: null,
            },
            {
              naam: "Kaas",
              winkel: "Colruyt",
            },
            {
              naam: "Pampers",
              winkel: "Kruidvat",
            },
          ],
          Verjaardagen: [
            {
              id: 1,
              voornaam: "Test",
              achternaam: "User",
              dagnummer: 1,
              maandnummer: 1,
              createdAt: expect.any(String),
              updatedAt: expect.any(String)
            },
            {
              id: 2,
              voornaam: "Test",
              achternaam: "Admin",
              dagnummer: 2,
              maandnummer: 2,
              createdAt: expect.any(String),
              updatedAt: expect.any(String)
            },
            {
              id: 3,
              voornaam: "Mikele",
              achternaam: "Lemmens",
              dagnummer: 30,
              maandnummer: 12,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            {
              id: 4,
              voornaam: "Charlotte",
              achternaam: "De Smet",
              dagnummer: 24,
              maandnummer: 8,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),            },
            {
              id: 5,
              voornaam: "Ellis",
              achternaam: "Lemmens",
              dagnummer: 23,
              maandnummer: 9,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            {
              id: 7,
              voornaam: "Katrijn",
              achternaam: "Goens",
              dagnummer: 15,
              maandnummer: 12,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          ],
        });

    });

    it('should 404 when requesting unexisting gezin by familienaam', async () => {
      const response = await request.get(`${url}?familienaam=Janssens`).set('Authorization', authHeader);
      ; 
      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er bestaat geen gezin genaamd Janssens',
        details: {
          familienaam: "Janssens",
        },
      });    
    });


    testAuthHeader(() => request.get(url));

  });
  describe('GET /api/gezinnen/:id', () => {
    beforeAll(async () => {

      await sequelize.models.Gezin.bulkCreate(data.gezinnen);
      await sequelize.models.Verjaardag.bulkCreate(data.verjaardagen);
      await sequelize.models.GezinVerjaardag.bulkCreate(data.gezinVerjaardagen);
      await sequelize.models.Gezinslid.bulkCreate(data.gezinsleden);
      await sequelize.models.Boodschap.bulkCreate(data.boodschappen);
      await sequelize.models.GeplandeTaak.bulkCreate(data.geplande_taken);

    });
    afterAll(async () => {
      await sequelize.models.GeplandeTaak.destroy({
        where: {
          id: dataToDelete.geplande_taken,
        },
      });
      await sequelize.models.Boodschap.destroy({
        where: {
          id: dataToDelete.boodschappen,
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
  

    it('should 200 and return the requested gezin', async () => {
      const response = await request.get(`${url}/1`).set('Authorization', authHeader);
      ; 
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        {
          
            id: 1,
            familienaam: "Lemmens - De Smet",
            straat: "Binnenslag",
            huisnummer: 63,
            postcode: 9920,
            stad: "Lovendegem",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            Gezinsleden: [
              {
                voornaam: "testuser",
                email: "test.user@gmail.com",
              },
              {
                voornaam: "testadmin",
                email: "test.admin@gmail.com",
              },
              {
                voornaam: "Mikele",
                email: "mikele.lemmens@hotmail.com",
              },
              {
                voornaam: "Charlotte",
                email: "desmetcharlotte2@gmail.com",
              },
              {
                voornaam: "Ellis",
                email: null,
              },
            ],
            Boodschappen: [
              {
                naam: "Choco",
                winkel: "Colruyt",
              },
              {
                naam: "Hondenbrokken",
                winkel: null,
              },
              {
                naam: "Kaas",
                winkel: "Colruyt",
              },
              {
                naam: "Pampers",
                winkel: "Kruidvat",
              },
            ],
            Verjaardagen: [
              {
                id: 1,
                voornaam: "Test",
                achternaam: "User",
                dagnummer: 1,
                maandnummer: 1,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              {
                id: 2,
                voornaam: "Test",
                achternaam: "Admin",
                dagnummer: 2,
                maandnummer: 2,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              {
                id: 3,
                voornaam: "Mikele",
                achternaam: "Lemmens",
                dagnummer: 30,
                maandnummer: 12,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              {
                id: 4,
                voornaam: "Charlotte",
                achternaam: "De Smet",
                dagnummer: 24,
                maandnummer: 8,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              {
                id: 5,
                voornaam: "Ellis",
                achternaam: "Lemmens",
                dagnummer: 23,
                maandnummer: 9,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              {
                id: 7,
                voornaam: "Katrijn",
                achternaam: "Goens",
                dagnummer: 15,
                maandnummer: 12,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
            ],
          
      });
    });

    it('should 404 when requesting not existing gezin', async () => {
      // Sign in as admin, any other gezinslid can only request the gezin he/she belongs to
      const response = await request.get(`${url}/3`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er bestaat geen gezin met id 3',
        details: {
          id: 3,
        },
      });

      expect(response.body.stack).toBeTruthy();
    });
    
    it('should 400 with invalid gezin id', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 200 and return all geplande taken for the requested gezin', async () => {
      const response = await request.get(`${url}/1/geplande_taken`).set('Authorization', authHeader);
      ; 
      expect(response.status).toBe(200);
      expect(response.body.geplandeTaken).toEqual([
            {
              id: 1,
              naam: "Ellis halen",
              dag: "2023-10-16",
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              gezinslid_id: 3,
            },
            {
              id: 2,
              naam: "Ellis halen",
              dag: "2023-10-17",
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              gezinslid_id: 3,
            }
          ]
      );
    });

    it('should 200 and return all gezinsleden for the requested gezin', async () => {
      const response = await request.get(`${url}/1/gezinsleden`).set('Authorization', authHeader);
      ; 
      expect(response.status).toBe(200);
      expect(response.body.gezinsleden).toEqual(
        [
          {
            id: 1,
            voornaam: "testuser",
            email: "test.user@gmail.com",
            wachtwoord: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
            roles: "[\"user\"]",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            gezin_id: 1,
            verjaardag_id: 1,
          },
          {
            id: 2,
            voornaam: "testadmin",
            email: "test.admin@gmail.com",
            wachtwoord: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
            roles: "[\"admin\",\"user\"]",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            gezin_id: 1,
            verjaardag_id: 2,
          },
          {
            id: 3,
            voornaam: "Mikele",
            email: "mikele.lemmens@hotmail.com",
            wachtwoord: "######",
            roles: "[\"admin\",\"user\"]",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            gezin_id: 1,
            verjaardag_id: 3,
          },
          {
            id: 4,
            voornaam: "Charlotte",
            email: "desmetcharlotte2@gmail.com",
            wachtwoord: "######",
            roles: "[\"user\"]",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            gezin_id: 1,
            verjaardag_id: 4,
          },
          {
            id: 5,
            voornaam: "Ellis",
            email: null,
            wachtwoord: null,
            roles: "[\"user\"]",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            gezin_id: 1,
            verjaardag_id: 5,
          },
        ]
      );
    });

    testAuthHeader(() => request.get(`${url}/1`));

  });
  describe('POST /api/gezinnen', () => {

    afterAll(async () => {

      await sequelize.models.Gezin.destroy({
        where: {
          id: gezinnenToDelete,
        }
      });
    });
    const gezinnenToDelete=[];

    it('should 201 and return the created gezin', async () => {
      // No authentication required to post a family
      const response = await request.post(url)
        .send({
          familienaam: "Pauwels - De Meyer",
          straat: "Kapellestraat",
          huisnummer: 146,
          postcode: 9870,
          stad: "Zulte"
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.huisnummer).toBe(146);
      expect(response.body.postcode).toBe(9870);
      expect(response.body.familienaam).toBe("Pauwels - De Meyer");
      expect(response.body.straat).toBe("Kapellestraat");
      expect(response.body.stad).toBe("Zulte");

      gezinnenToDelete.push(response.body.id);
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
     it('should 400 when postcode < 1000', async () => {
      const response = await request.post(url)
       .send({
         familienaam: "Pauwels - De Meyer",
         huisnummer: 146,
         straat: "Kapellestraat",
         stad: "Zulte",
         postcode: 999
       });
 
     expect(response.statusCode).toBe(400);
     expect(response.body.code).toBe('VALIDATION_FAILED');
     expect(response.body.details.body).toHaveProperty('postcode');
     });
     it('should 400 when postcode > 9999', async () => {
      const response = await request.post(url)
       .send({
         familienaam: "Pauwels - De Meyer",
         huisnummer: 146,
         straat: "Kapellestraat",
         stad: "Zulte",
         postcode: 10000
       });
 
     expect(response.statusCode).toBe(400);
     expect(response.body.code).toBe('VALIDATION_FAILED');
     expect(response.body.details.body).toHaveProperty('postcode');
     });
     it('should 400 when postcode is decimal', async () => {
      const response = await request.post(url)
       .send({
         familienaam: "Pauwels - De Meyer",
         huisnummer: 146,
         straat: "Kapellestraat",
         stad: "Zulte",
         postcode: 9000.1
       });
 
     expect(response.statusCode).toBe(400);
     expect(response.body.code).toBe('VALIDATION_FAILED');
     expect(response.body.details.body).toHaveProperty('postcode');
     });
    });
  describe('PUT /api/gezinnen/:id', () => {

    beforeAll(async () => {
      await sequelize.models.Gezin.create( 
               {
                id:3,
                familienaam: "Pauwels - De Meyer",
                straat: "Kapellestraat",
                huisnummer: 146,
                postcode: 9870,
                stad: "Zulte"
              });
    });
    afterAll(async()=> {
      await sequelize.models.Gezin.destroy({
        where: {
          id: 3,
        }
      });
    });

    it('should 200 and return the updated gezin', async () => {
      const response = await request.put(`${url}/3`).set('Authorization',adminAuthHeader)
        .send({
          familienaam: "De Meyer - Pauwels",
          straat: "Kapellestraat",
          huisnummer: 146,
          postcode: 9870,
          stad: "Zulte"
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        {
          id:3,
          familienaam: "De Meyer - Pauwels",
          straat: "Kapellestraat",
          huisnummer: 146,
          postcode: 9870,
          stad: "Zulte",
          Boodschappen:[],
          Gezinsleden:[],
          Verjaardagen:[],
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }
      )
    });

    it('should 404 when updating not existing gezin', async () => {
      const response = await request.put(`${url}/4`).set('Authorization',adminAuthHeader)
        .send({
          familienaam: "Pauwels - De Meyer",
          straat: "Kapellestraat",
          huisnummer: 146,
          postcode: 9870,
          stad: "Zulte"
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er bestaat geen gezin met id 4',
        details: {
          id: 4,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing familienaam', async () => {
      const response = await request.put(`${url}/3`).set('Authorization',adminAuthHeader)
        .send({
          straat: "Kapellestraat",
          huisnummer: 146,
          postcode: 9870,
          stad: "Zulte"
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('familienaam');
    });
    it('should 400 when missing straat', async () => {
      const response = await request.put(`${url}/3`).set('Authorization',adminAuthHeader)
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
    it('should 400 when missing huisnummer', async () => {
      const response = await request.put(`${url}/3`).set('Authorization',adminAuthHeader)
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
    it('should 400 when missing postcode', async () => {
      const response = await request.put(`${url}/3`).set('Authorization',adminAuthHeader)
        .send({
          familienaam: "Pauwels - De Meyer",
          straat: "Kapellestraat",
          huisnummer: 146,
          stad: "Zulte"
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('postcode');
    });
    it('should 400 when missing stad', async () => {
      const response = await request.put(`${url}/3`).set('Authorization',adminAuthHeader)
        .send({
          familienaam: "Pauwels - De Meyer",
          straat: "Kapellestraat",
          huisnummer: 146,
          postcode: 9870,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('stad');
    });
    testAuthHeader(() => request.put(`${url}/1`));


  });
  describe('DELETE /api/gezinnen/:id', () => {

    beforeAll(async () => {
      await sequelize.models.Gezin.create(data.gezinnen[0]);
     });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/2`).set('Authorization',adminAuthHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing gezin', async () => {
      const response = await request.delete(`${url}/2`).set('Authorization',adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Er bestaat geen gezin met id 2',
        details: {
          id: 2,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid gezin id', async () => {
      const response = await request.delete(`${url}/invalid`).set('Authorization',adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
    testAuthHeader(() => request.delete(`${url}/1`));

  });
});
