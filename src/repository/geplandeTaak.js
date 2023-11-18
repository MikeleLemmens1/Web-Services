const {getKnex, tables}= require('../data/index');
const geplande_taken = require('../rest/geplande_taken');

const findAllGeplandeTaken = async()=> {
  return await getKnex()(tables.geplandeTaak).select().orderBy('id','ascending');
}

const findGeplandeTaakById = async (id) => {
  return await getKnex()(tables.geplandeTaak).select().where('geplandeTaak.id',id);
}

const createGeplandeTaak = async ({ naam, dag, gezinslidId }) => {
  //     👇 3
  const [id] = await getKnex()(tables.geplandeTaak).insert({
    naam,
    dag,
    gezinslidId,
  }); // 👈 2
  return id; // 👈 3
};

const updateGeplandeTaakById = async (id, {naam, dag, gezinslidId}) => {

  const [mySQLid] = await getKnex()(tables.geplandeTaak).where('id', id).update({
    naam,
    gezinslidId,
    dag
  });
  return mySQLid;
}
const deleteGeplandeTaakById = async (id) => {

  const [mySQLid] = await getKnex()(tables.geplandeTaak).where('id', id).del();
  return mySQLid;
}

module.exports = {
  findAllGeplandeTaken,
  findGeplandeTaakById,
  createGeplandeTaak,
  updateGeplandeTaakById,
  deleteGeplandeTaakById
};