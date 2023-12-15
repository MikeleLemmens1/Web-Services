const { getLogger } = require('../core/logging');
const geplandeTakenRepo = require('../repository/geplandeTaak');
const gezinsledenService = require('./gezinsleden');
// const handleDBError = require('./_handleDBError');

// const ServiceError = require('../core/serviceError');
// const handleDBError = require('./_handleDBError');

const getAll = async () => {
  const items = await geplandeTakenRepo.findAllGeplandeTaken(); // 👈 2
  return {
    items,
    count: items.length,
  };
};


const getAllByDay = async (dag) => { 
  const geplandeTaken = await geplandeTakenRepo.findGeplandeTakenByDay(dag);
  if (!geplandeTaken) {
    //TODO Service en DB Error
    //throw ServiceError.notFound(`Er bestaat geen taak met id ${id}`, { id });
  }

  return geplandeTaken;}

const getAllByWeek = (week) => {
  //TODO
}
const getAllByGezinslidId = async (id) => {
  const geplandeTaken = await geplandeTakenRepo.findGeplandeTakenByGezinslidId(id);
  if (!geplandeTaken) {
    //TODO Service en DB Error
    //throw ServiceError.notFound(`Er bestaat geen taak met id ${id}`, { id });
  }
  return geplandeTaken; 
};

const getById = async (id) => {
  const geplandeTaak = await geplandeTakenRepo.findGeplandeTaakById(id);

  if (!geplandeTaak) {
    // throw ServiceError.notFound(`Er bestaat geen taak met id ${id}`, { id });
  }

  return geplandeTaak;
};


const create = async ({ naam, dag, gezinslidId }) => {
  let bestaandGezinslid = await gezinsledenService.getGezinslidById(gezinslidId);
  if (!bestaandGezinslid){
    getLogger().error("Gezinslid niet gevonden")
    // throw ServiceError.notFound(`Er is geen gezinslid id ${id}.`, { id });

  }
  try {
    const id = await geplandeTakenRepo.createGeplandeTaak({
      naam,
      dag,
      gezinslidId,
    });
    return getById(id);
  } catch (error) {
    
    getLogger().error("Fout bij het maken van de geplande taak")
    // throw handleDBError(error);
  }
};
const updateById = async (id, { naam, dag, gezinslidId}) => {
  if (gezinslidId) {
    const bestaandGezinslid = await gezinsledenService.getGezinslidById(gezinslidId);

    if (!bestaandGezinslid) {
      // throw ServiceError.notFound(`Er is geen gezinslid met id ${id}.`, { id });
    }
  }
  try {
    await geplandeTakenRepo.updateGeplandeTaakById(id, {
      naam,
      dag,
      gezinslidId,
    });
    return getById(id);
  } catch (error) {
    getLogger().error("Fout bij het wijzigen van de geplande taak")
    // throw handleDBError(error);
  }
};
const deleteById = async (id) => {
  try {
    const deleted = await geplandeTakenRepo.deleteGeplandeTaakById(id);

    if (!deleted) {
      // throw ServiceError.notFound(`Geen geplande taak met id ${id} gevonden`, { id });
    }
  } catch (error) {
    getLogger().error("Fout bij het verwijderen van de geplande taak")
    // throw handleDBError(error);
  }
};

module.exports = {
  getAll,
  getAllByDay,
  getAllByWeek,
  getAllByGezinslidId,
  create,
  updateById,
  deleteById,
};