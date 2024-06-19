'use strict';
/**
 * Seeder file for Geplande Taak table
 * @type {import('sequelize-cli').Seeder} 
 */
module.exports = {
  async up(queryInterface, Sequelize){
    await queryInterface.bulkInsert('Geplandetaken',
    [
      {
        id: 1,
        naam: "Ellis halen",
        dag: "2023-10-16",
        gezinslid_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        naam: "Ellis halen",
        dag: "2023-10-17",
        gezinslid_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        naam: "Ellis halen",
        dag: "2023-10-18",
        gezinslid_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        naam: "Ellis halen",
        dag: "2023-10-19",
        gezinslid_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        naam: "Ellis halen",
        dag: "2023-10-20",
        gezinslid_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        naam: "Ellis brengen",
        dag: "2023-10-16",
        gezinslid_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        naam: "Ellis brengen",
        dag: "2023-10-17",
        gezinslid_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        naam: "Ellis brengen",
        dag: "2023-10-18",
        gezinslid_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        naam: "Ellis brengen",
        dag: "2023-10-19",
        gezinslid_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        naam: "Ellis brengen",
        dag: "2023-10-20",
        gezinslid_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 11,
        naam: "Koken",
        dag: "2023-10-16",
        gezinslid_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 12,
        naam: "Koken",
        dag: "2023-10-17",
        gezinslid_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 13,
        naam: "Koken",
        dag: "2023-10-18",
        gezinslid_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 14,
        naam: "Koken",
        dag: "2023-10-19",
        gezinslid_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 15,
        naam: "Koken",
        dag: "2023-10-20",
        gezinslid_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 16,
        naam: "Hond uitlaten",
        dag: "2023-10-16",
        gezinslid_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 17,
        naam: "Hond uitlaten",
        dag: "2023-10-17",
        gezinslid_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 18,
        naam: "Hond uitlaten",
        dag: "2023-10-18",
        gezinslid_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 19,
        naam: "Hond uitlaten",
        dag: "2023-10-19",
        gezinslid_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 20,
        naam: "Hond uitlaten",
        dag: "2023-10-20",
        gezinslid_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },
  async down(queryInterface, Sequelize){
    await queryInterface.bulkDelete('Geplandetaken', null, {});
  } 
};