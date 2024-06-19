'use strict';
/**
 * Migration file for creating Booschap table
 * @type {import('sequelize-cli').Migration} 
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Boodschappen', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      naam:{
        type: Sequelize.STRING,
        allowNull: false,
        unique:false
      },
      winkel: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
      },
      hoeveelheid: {
        type: Sequelize.STRING,
        allowNull: true,
        unique:false
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
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Boodschappen');
  }
};