'use strict';
/**
 * Seeder file for Kalender table
 * @type {import('sequelize-cli').Seeder} 
 */
module.exports = {
  async up(queryInterface, Sequelize){
    await queryInterface.bulkInsert('Kalenders',
    [
      {
        id:1,
        gezin_id: 1,
        verjaardag_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id:2,
        gezin_id: 1,
        verjaardag_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id:3,
        gezin_id: 1,
        verjaardag_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id:4,
        gezin_id: 2,
        verjaardag_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id:5,
        gezin_id: 2,
        verjaardag_id: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id:6,
        gezin_id: 1,
        verjaardag_id: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id:7,
        gezin_id: 2,
        verjaardag_id: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },
  async down(queryInterface, Sequelize){
    await queryInterface.bulkDelete('Kalenders', null, {});
  } 
};