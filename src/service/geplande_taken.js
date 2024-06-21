const { getLogger } = require('../core/logging');
// const geplandeTakenRepo = require('../repository/geplandeTaak');
const gezinsledenService = require('./gezinsleden');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');
const { getGezinslidById } = require('./gezinsleden');
const { getSequelize } = require('../data');

const getAllGeplandeTaken = async (id) => {
  // const gezinslid = await getGezinslidById(id);
  const geplandeTaken = await getSequelize().models.GeplandeTaak.findAll({
    // where: { gezinslid_id: gezinslid.id },
  });
  return {
    geplandeTaken,
    count: geplandeTaken.length,  
  };
};


const getAllGeplandeTakenByDay = async (id,dag) => { 
  const gezinslid = await getGezinslidById(id);
  const geplandeTaken = await getSequelize().models.GeplandeTaak.findAll({
    where: { 
      gezinslid_id: gezinslid.id,
      dag: dag
     },
  });  if (!geplandeTaken) {
    throw ServiceError.notFound(`Er bestaat geen taak voor ${dag}`, { dag });
  }

  return geplandeTaken;
}

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

const updateGeplandeTaakById = async (id, { naam, dag, gezinslid_id}) => {
  // Error thrown by getGeplandeTaakById if not found
  const geplandeTaak = await getGeplandeTaakById(id);
  await geplandeTaak.set({
    naam,
    dag,
    // Foreign key needs to be set using builtin method
    // gezinslid_id,
  })
  await geplandeTaak.save();
  await geplandeTaak.setGezinslid(gezinslid_id);
  try {
    return getGeplandeTaakById(id);
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
  getAllGeplandeTakenByDay,
  getGeplandeTaakById,
  createGeplandeTaak,
  updateGeplandeTaakById,
  deleteGeplandeTaakById  ,
};