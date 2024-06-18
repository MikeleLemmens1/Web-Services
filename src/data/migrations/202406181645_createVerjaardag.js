'use strict';
/**
 * Migration file for creating Verjaardag table
 * @type {import('sequelize-cli').Migration} 
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Verjaardagen', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      voornaam:{
        type: Sequelize.STRING,
        allowNull: false,
        unique:false
      },
      familienaam: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
      },
      maandnummer: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dagnummer: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Verjaardagen');
  }
};