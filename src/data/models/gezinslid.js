'use strict';
/**
 * Model for Gezinslid
 * @typedef {import('sequelize').Model} Gezinslid
 */
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gezinslid extends Model {
    /*
    Methode om relaties te definiëren in data/index.js

    Een gezinslid heeft N geplande taken
    Een gezinslid heeft 1 verjaardag
    Een gezinslid behoort toe aan 1 gezin
    */
    static associate(models) {
      // Ook geen alias bij belongsTo
      Gezinslid.hasMany(models.GeplandeTaak, {foreignKey: 'gezinslid_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
      Gezinslid.belongsTo(models.Gezin,{foreignKey: 'gezin_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
      Gezinslid.belongsTo(models.Verjaardag, {foreignKey: {allowNull: false, name: 'verjaardag_id'}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    }
  }
  Gezinslid.init({
    voornaam: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING, 
      allowNull: true
    },
    wachtwoord: {
      type: DataTypes.STRING, 
      allowNull: true
    },
    roles: {
      type: DataTypes.JSON, 
      allowNull: false
    }
  }, {
    sequelize,
    tableName:'gezinsleden',
    modelName:'Gezinslid',
    name:{
      singular:'Gezinslid',
      plural:'Gezinsleden',
    },
    // freezeTableName: true,
    });
  return Gezinslid;
};