'use strict';
/**
 * Seeder file for Gezin table
 * @type {import('sequelize-cli').Seeder} 
 */
module.exports = {
  async up(queryInterface, Sequelize){
    await queryInterface.bulkInsert('Gezinnen',
    [
      {
        id: 1,
        familienaam: "Lemmens - De Smet",
        straat: "Binnenslag",
        huisnummer: 63,
        postcode: 9920,
        stad: "Lovendegem",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        familienaam: "Lemmens - Roebroek",
        straat: "Joost Van De Vondelplein",
        huisnummer: 27,
        postcode: 9940,
        stad: "Ertvelde",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },
  async down(queryInterface, Sequelize){
    await queryInterface.bulkDelete('Gezinnen', null, {});
  } 
};