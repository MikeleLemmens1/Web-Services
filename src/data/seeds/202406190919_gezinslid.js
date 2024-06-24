'use strict';
/**
 * Seeder file for Gezinslid table
 * @type {import('sequelize-cli').Seeder} 
 */

const Role = require('../../core/roles');

module.exports = {
  async up(queryInterface, Sequelize){
    await queryInterface.bulkInsert('Gezinsleden',
    [
      {
        id: 1,
        voornaam: "Mikele",
        email: "mikele.lemmens@hotmail.com",
        wachtwoord: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
        gezin_id: 1,
        verjaardag_id: 1,
        roles: JSON.stringify([Role.ADMIN, Role.USER]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        voornaam: "Charlotte",
        email: "desmetcharlotte2@gmail.com",
        wachtwoord: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
        gezin_id: 1,
        verjaardag_id: 2,
        roles: JSON.stringify([Role.USER]),
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
        roles: JSON.stringify([Role.USER]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        voornaam: "Mattia",
        email: "Mattia.Lemmens@hotmail.com",
        wachtwoord: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
        gezin_id: 2,
        verjaardag_id: 4,
        roles: JSON.stringify([Role.USER]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        voornaam: "Myrthe",
        email: "Myrthe.Roebroek@gmail.com",
        wachtwoord: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
        gezin_id: 2,
        verjaardag_id: 6,
        roles: JSON.stringify([Role.USER]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },
  async down(queryInterface, Sequelize){
    await queryInterface.bulkDelete('Gezinsleden', null, {});
  } 
};