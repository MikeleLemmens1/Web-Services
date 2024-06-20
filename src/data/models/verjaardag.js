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
      Verjaardag.hasOne(models.Gezinslid,{foreignKey: 'verjaardag_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
      Verjaardag.belongsToMany(models.Gezin, {through: 'GezinVerjaardag',foreignKey:'verjaardag_id'})
    }
  }
  Verjaardag.init({
    voornaam: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    achternaam: {
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
    tableName: 'verjaardagen',
    // name:{
    //   singular:'Verjaardag',
    //   plural:'Verjaardagen',
    // },  
    modelName: 'Verjaardag',
    // freezeTableName:true,
  });
  return Verjaardag;
};