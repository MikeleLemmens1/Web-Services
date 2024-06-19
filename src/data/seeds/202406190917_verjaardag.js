'use strict';
/**
 * Seeder file for Verjaardag table
 * @type {import('sequelize-cli').Seeder} 
 */
module.exports = {
  async up(queryInterface, Sequelize){
    await queryInterface.bulkInsert('Verjaardagen',
    [
      {
        id: 1,
        dagnummer: 30,
        maandnummer: 12,
        voornaam: "Mikele",
        achternaam: "Lemmens",
        createdAt: new Date(),
        updatedAt: new Date()

      },
      {
        id: 2,
        dagnummer: 24,
        maandnummer: 8,
        voornaam: "Charlotte",
        achternaam: "De Smet",
        createdAt: new Date(),
        updatedAt: new Date()

      },
      {
        id: 3,
        dagnummer: 23,
        maandnummer: 9,
        voornaam: "Ellis",
        achternaam: "Lemmens",
        createdAt: new Date(),
        updatedAt: new Date()
        
      },
      {
        id: 4,
        dagnummer: 30,
        maandnummer: 12,
        voornaam: "Mattia",
        achternaam: "Lemmens",
        createdAt: new Date(),
        updatedAt: new Date()
    
      },
      {
        id: 5,
        dagnummer: 15,
        maandnummer: 12,
        voornaam: "Katrijn",
        achternaam: "Goens",
        createdAt: new Date(),
        updatedAt: new Date()
    
      },
      {
        id: 6,
        dagnummer: 10,
        maandnummer: 11,
        voornaam: "Myrthe",
        achternaam: "Roebroek",
        createdAt: new Date(),
        updatedAt: new Date()
    
      }
    ])
  },
  async down(queryInterface, Sequelize){
    await queryInterface.bulkDelete('Verjaardagen', null, {});
  } 
};