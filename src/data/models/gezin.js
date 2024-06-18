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
      // FK's worden automatisch gegenereerd indien niet gespecifieerd -> Testen
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
    tableName:'gezinnen',
    // name:{
    //   singular:'Gezin',
    //   plural:'Gezinnen',
    // },
    // Make sure to use the self-defined plural
    // freezeTableName: true,
  });
  return Gezin;
};