'use strict';
/**
 * Seeder file for Boodschap table
 * @type {import('sequelize-cli').Seeder} 
 */
module.exports = {
  async up(queryInterface, Sequelize){
    await queryInterface.bulkInsert('Boodschappen',
    [
      {
        id: 1,
        naam: "Choco",
        winkel: "Colruyt",
        hoeveelheid: "1 pot",
        gezin_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        naam: "Hondenbrokken",
        winkel: null,
        hoeveelheid: null,
        gezin_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        naam: "Kaas",
        winkel: "Colruyt",
        hoeveelheid: null,
        gezin_id:1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        naam: "Pampers",
        winkel: "Kruidvat",
        hoeveelheid: null,
        gezin_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        naam: "Pampers",
        winkel: "Kruidvat",
        hoeveelheid: null,
        gezin_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },
  async down(queryInterface, Sequelize){
    await queryInterface.bulkDelete('Boodschappen', null, {});
  } 
};