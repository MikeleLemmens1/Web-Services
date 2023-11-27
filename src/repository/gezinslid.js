const {getKnex, tables}= require('../data');

const findAll = async()=> {
  return await getKnex()(tables.gezinslid).select().orderBy('voornaam','ascending');
}
const findById = async(id)=> {
  return await getKnex()(tables.gezinslid).select().where('id',id);
}

module.exports = {
  findAll,
  findById
};