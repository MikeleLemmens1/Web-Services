'use strict';
/**
 * Model for GezinVerjaardag
 * @typedef {import('sequelize').Model} GezinVerjaardag
 */
const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GezinVerjaardag extends Model {

    static associate(models) {
    }
  }
  GezinVerjaardag.init({
  }, {
    sequelize,
    modelName: 'GezinVerjaardag',
    tableName: 'gezinVerjaardagen',
    // name:{
    //   singular:'GezinVerjaardag',
    //   plural:'GezinVerjaardagen',
    // },
    // freezeTableName:true,

  });
  return GezinVerjaardag;
};