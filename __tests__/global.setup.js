const config = require('config'); 
const { initializeLogger } = require('../src/core/logging'); 
const Role = require('../src/core/roles'); 
const { initializeData, getSequelize } = require('../src/data/index');



module.exports = async () => {
  // Create a database connection
  initializeLogger({
    level: config.get('logging.level'),
    disabled: config.get('logging.disabled'),
  });
  await initializeData(); 

  // Insert a test user with password 12345678
  const sequelize = getSequelize(); 
  await sequelize.sync({ force: true });
  // console.log(sequelize.models);

  await sequelize.models.Gezin.bulkCreate([{
    id: 1,
    familienaam: "Lemmens - De Smet",
    straat: "Binnenslag",
    huisnummer: 63,
    postcode: 9920,
    stad: "Lovendegem",
  }]);
  await sequelize.models.Verjaardag.bulkCreate([
    {
    id: 1,
    dagnummer: 1,
    maandnummer: 1,
    voornaam: "Test",
    achternaam: "User",
    },
    {
    id: 2,
    dagnummer: 2,
    maandnummer: 2,
    voornaam: "Test",
    achternaam: "Admin",
    },
  ]);
  await sequelize.models.Gezinslid.bulkCreate([
    {
      id: 1,
      voornaam: "testuser",
      email: "test.user@gmail.com",
      wachtwoord: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
      gezin_id: 1,
      verjaardag_id: 1,
      roles: JSON.stringify([Role.USER]),
    },
    {
      id: 2,
      voornaam: "testadmin",
      email: "test.admin@gmail.com",
      wachtwoord: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
      gezin_id: 1,
      verjaardag_id: 2,
      roles: JSON.stringify([Role.ADMIN,Role.USER]),
    },

  ]);
  await sequelize.models.GezinVerjaardag.bulkCreate([
    {
      id: 1,
      gezin_id: 1,
      verjaardag_id: 1,
    },
    {
      id: 2,
      gezin_id: 1,
      verjaardag_id: 2,
    },
  ]);
  

};
