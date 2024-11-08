'use strict';
/**
 * Migration file for creating Gezin table
 * @type {import('sequelize-cli').Migration} 
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Gezinnen', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      familienaam: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      straat: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      huisnummer: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      postcode: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      stad: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Gezinnen');
  }
};