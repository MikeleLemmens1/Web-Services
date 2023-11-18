const {getKnex, tables}= require('../data');

const findAll = async()=> {
  return await getKnex()(tables.gezinslid).select().orderBy('voornaam','ascending');
}

module.exports = {
  findAll
};