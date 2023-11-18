const {getKnex, tables}= require('../data');

const findAll = async()=> {
  return await getKnex()(tables.verjaardag).select().orderBy('maand','ascending');
}

module.exports = {
  findAll
};