'use strict';
/**
 * Model for Verjaardag
 * @typedef {import('sequelize').Model} Verjaardag
 */
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Verjaardag extends Model {
    /*
    Methode om relaties te definiëren in data/index.js

    Een Verjaardag heeft N kalenderitems
    Een Verjaardag behoort toe aan 0..1 gezinslid (optional by default)
    Een Verjaardag behoort toe aan 0..N Gezinnen
    belongs
    */
    static associate(models) {
      // Verjaardag.hasMany(models.KalenderItem, {foreignKey: 'verjaardag_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
      Verjaardag.belongsTo(models.Gezinslid,{foreignKey: 'verjaardag_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
      Verjaardag.belongsToMany(models.Gezin,{through: 'KalenderItem'})
    }
  }
  Verjaardag.init({
    voornaam: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    familienaam: {
      type: DataTypes.STRING, 
      allowNull: true
    },
    dagnummer: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    maandnummer: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
  }, {
    sequelize,
    name:{
      singular:'Verjaardag',
      plural:'Verjaardagen',
    },  });
  return Verjaardag;
};