'use strict';
/**
 * Migration file for creating Gezinslid table
 * @type {import('sequelize-cli').Migration} 
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Gezinsleden', {
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
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      wachtwoord: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      gezin_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Gezinnen',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      verjaardag_id:{
        type: Sequelize.INTEGER,
        references: {
          model: 'Verjaardagen',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }

      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Gezinsleden');
  }
};