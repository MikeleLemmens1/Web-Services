'use strict';
/**
 * Seeder file for Gezinslid table
 * @type {import('sequelize-cli').Seeder} 
 */
module.exports = {
  async up(queryInterface, Sequelize){
    await queryInterface.bulkInsert('Gezinsleden',
    [
      {
        id: 1,
        voornaam: "Mikele",
        email: "mikele.lemmens@hotmail.com",
        wachtwoord: "######",
        gezin_id: 1,
        verjaardag_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        voornaam: "Charlotte",
        email: "desmetcharlotte2@gmail.com",
        wachtwoord: "######",
        gezin_id: 1,
        verjaardag_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        voornaam: "Ellis",
        email: null,
        wachtwoord: null,
        gezin_id: 1,
        verjaardag_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        voornaam: "Mattia",
        email: "Mattia.Lemmens@hotmail.com",
        wachtwoord: "######",
        gezin_id: 2,
        verjaardag_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        voornaam: "Myrthe",
        email: "Myrthe.Roebroek@gmail.com",
        wachtwoord: "######",
        gezin_id: 2,
        verjaardag_id: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },
  async down(queryInterface, Sequelize){
    await queryInterface.bulkDelete('Gezinsleden', null, {});
  } 
};