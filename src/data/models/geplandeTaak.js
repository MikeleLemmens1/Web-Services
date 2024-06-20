'use strict';
/**
 * Model for Geplande Taak
 * @typedef {import('sequelize').Model} geplandeTaak
 */
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GeplandeTaak extends Model {
    /*
    Methode om relaties te definiëren in data/index.js

    Een geplande taak behoort toe aan 1 gezinslid
    */
    static associate(models) {
      GeplandeTaak.belongsTo(models.Gezinslid, {foreignKey: 'gezinslid_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
      }
  }
  GeplandeTaak.init({
    naam: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    dag: {
      type: DataTypes.STRING, 
      allowNull: false
    },

  }, {
    sequelize,
    tableName: 'geplandeTaken',
    modelName: 'GeplandeTaak',
    name:{
      singular:'GeplandeTaak',
      plural:'GeplandeTaken',
    },
  });
  return GeplandeTaak;
};