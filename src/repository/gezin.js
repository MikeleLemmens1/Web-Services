const {getKnex, tables}= require('../data');

const findAll = async()=> {
  return await getKnex()(tables.gezin).select().orderBy('id');
}

module.exports = {
  findAll
};