const {getKnex, tables}= require('../data');

const findAll = async()=> {
  return await getKnex()(tables.geplandeTaak).select().orderBy('dag','ascending');
}

module.exports = {
  findAll
};