const { getLogger } = require('../core/logging');
const gezinsledenService = require('./gezinsleden');
const gezinService = require('./gezinnen');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');
const { getGezinslidById } = require('./gezinsleden');
const { getSequelize } = require('../data');
const { log } = require('winston');

const getAllGeplandeTaken = async (ctx) => {
  if (ctx.query.all){
    return getAllGeplandeTakenFromGezin(gezin_id)
  }
  const gezinslid = await getGezinslidById(ctx.params.id);
  const geplandeTaken = await getSequelize().models.GeplandeTaak.findAll({
    where: { gezinslid_id: gezinslid.id },
  });
  return {
    geplandeTaken,
    count: geplandeTaken.length,  
  };
};

const getAllGeplandeTakenFromGezin = async (gezin_id) => {
  const gezin = await gezinService.getAllGezinsledenFromGezin(gezin_id)
  const gezinsleden = await gezin.gezinsleden;
  let ids = []
  for (i in gezinsleden) {
    ids.push(gezinsleden[i].id);
    
  }
    const geplandeTaken = await getSequelize().models.GeplandeTaak.findAll({
    where: { 
      gezinslid_id: ids,}
    });
  return {
    geplandeTaken,
    count: geplandeTaken.length,  
  };
};


// const getAllGeplandeTakenByDay = async (id,dag) => { 
//   const gezinslid = await getGezinslidById(id);
//   const geplandeTaken = await getSequelize().models.GeplandeTaak.findAll({
//     where: { 
//       gezinslid_id: gezinslid.id,
//       dag: dag
//      },
//   });  if (!geplandeTaken) {
//     throw ServiceError.notFound(`Er bestaat geen taak voor ${dag}`, { dag });
//   }

//   return geplandeTaken;
// }

const getGeplandeTaakById = async (id) => {
  const geplandeTaak = await getSequelize().models.GeplandeTaak.findByPk(id);

  if (!geplandeTaak) {
    throw ServiceError.notFound(`Er bestaat geen geplande taak met id ${id}`, { id });
  }

  return geplandeTaak;
};

const createGeplandeTaak = async ({ naam, dag, gezinslid_id }) => {
  let gezinslid = await getGezinslidById(gezinslid_id);
  if (!gezinslid){
    throw ServiceError.notFound(`Er is geen gezinslid id ${id}.`, { id });
  }
  try {
    const geplandeTaak = await getSequelize().models.GeplandeTaak.create({
      naam,
      dag,
      gezinslid_id,
    });
    return getGeplandeTaakById(geplandeTaak.id);
  } catch (error) {    
    getLogger().error("Fout bij het maken van de geplande taak")
    throw handleDBError(error);
  }
};

const updateGeplandeTaakById = async (id, taak_id, { naam, dag}) => {
  // Error thrown by getGeplandeTaakById if not found
  const geplandeTaak = await getGeplandeTaakById(taak_id);
  await geplandeTaak.set({
    naam,
    dag,
    // Foreign key needs to be set using builtin method
    // gezinslid_id,
  })
  await geplandeTaak.save();
  await geplandeTaak.setGezinslid(id);
  try {
    return getGeplandeTaakById(taak_id);
  } catch (error) {
    getLogger().error("Fout bij het wijzigen van de geplande taak")
    throw handleDBError(error);
  }
};
const deleteGeplandeTaakById = async (id) => {
  try {
    const deleted = await getGeplandeTaakById(id);
    await deleted.destroy();
  
  } catch (error) {
    getLogger().error("Fout bij het verwijderen van de geplande taak")
    throw handleDBError(error);
  }
};

module.exports = {
  getAllGeplandeTaken,
  // getAllGeplandeTakenByDay,
  getAllGeplandeTakenFromGezin,
  getGeplandeTaakById,
  createGeplandeTaak,
  updateGeplandeTaakById,
  deleteGeplandeTaakById  ,
};