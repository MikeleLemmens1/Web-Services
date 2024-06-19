'use strict';
/**
 * Migration file for creating Geplande Taak table
 * @type {import('sequelize-cli').Migration} 
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GeplandeTaken', {
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
      dag: {
        type: Sequelize.DATE,
        unique: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      gezinslid_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Gezinsleden',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('GeplandeTaken');
  }
};