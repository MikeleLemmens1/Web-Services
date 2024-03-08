'use strict';
/**
 * Model for Gezin
 * @typedef {import('sequelize').Model} Gezin
 */
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gezin extends Model {
    /*
    Methode om relaties te definiëren in data/index.js

    Een gezin heeft N gezinsleden
    Een gezin heeft N KalenderItems
    Een gezin heeft N Boodschappen
    */
    static associate(models) {
      Gezin.hasMany(models.Gezinslid, {foreignKey: 'gezin_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
      Gezin.hasMany(models.Boodschap, {foreignKey: 'gezin_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
      Gezin.belongsToMany(models.Verjaardag,{through: 'KalenderItem'})

    }
  }

  Gezin.init({
    familienaam: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    straat: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    huisnummer: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    postcode: {
      type: DataTypes.INTEGER, 
      allowNull: false
    },
    stad: {
      type: DataTypes.STRING, 
      allowNull: false
    },
  }, 
  {
    sequelize,
    name:{
      singular:'Gezin',
      plural:'Gezinnen',
    },  });
  return Gezin;
};