'use strict';
/**
 * Model for Boodschap
 * @typedef {import('sequelize').Model} Boodschap
 */
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Boodschap extends Model {
    /*
     * Methode om relaties te definiëren in data/index.js
     *
     * Een boodschap behoort toe aan 1 gezin
     */
    static associate(models) {
      Boodschap.belongsTo(models.Gezin, {foreignKey: 'gezin_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
      }
  }
  Boodschap.init({
    naam: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    winkel: {
      type: DataTypes.STRING, 
      allowNull: true
    },
    hoeveelheid: {
      type: DataTypes.STRING, 
      allowNull: true
    },
  }, {
    sequelize,
    name:{
      singular:'Boodschap',
      plural:'Boodschappen',
    },
    tableName:'boodschappen',
    modelName:'Boodschap',
  });
  return Boodschap;
};