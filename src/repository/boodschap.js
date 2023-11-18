const {getKnex, tables}= require('../data');

const findAll = async()=> {
  return await getKnex()(tables.boodschap).select().orderBy('boodschapId','ascending');
}

module.exports = {
  findAll
};