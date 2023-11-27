const { Logger } = require('winston');
const { getLogger } = require('../core/logging');
const geplandeTakenRepo = require('../repository/geplandeTaak');
const gezinsledenService = require('./gezinsleden');

// const ServiceError = require('../core/serviceError');
// const handleDBError = require('./_handleDBError');

const getAll = async () => {
  const items = await geplandeTakenRepo.findAllGeplandeTaken(); // 👈 2
  return {
    items,
    count: items.length,
  };
};

// const getAll = () => {
//   return {items: GEPLANDE_TAKEN};
// };
// Routing voor toevoegen van Knex

const getAllByDay = async (dag) => { 
  const geplandeTaken = await geplandeTakenRepo.findGeplandeTaakByDay(dag);
  if (!geplandeTaken) {
    //TODO Service en DB Error
    //throw ServiceError.notFound(`Er bestaat geen taak met id ${id}`, { id });
  }

  return geplandeTaken;}

const getAllByWeek = (week) => {
  //TODO
}
const getBygezinslidId = async (id) => {
  const geplandeTaak = await geplandeTakenRepo.getBygezinslidId(id);
  if (!geplandeTaak) {
    //TODO Service en DB Error
    //throw ServiceError.notFound(`Er bestaat geen taak met id ${id}`, { id });
  }

  return geplandeTaak; 
};


const create = async ({ naam, dag, gezinslidId }) => {
  let geldigGezinslid;
  if (gezinslidId){
    geldigGezinslid = await gezinsledenService.getGezinslidByID(id);
  }
  if (!geldigGezinslid){
    getLogger().error("Gezinslid niet gevonden")
  }
  try {
    const id = await geplandeTakenRepo.createGeplandeTaak({
      naam,
      dag,
      gezinslidId,
    });
    return getBygezinslidId(id);
  } catch (error) {
    throw handleDBError(error);
  }
};
const updateById = async (id, { naam, dag, gezinslidId}) => {
  if (gezinslidId) {
    const bestaandGezinslid = await gezinsledenService.getById(gezinslidId);

    if (!bestaandGezinslid) {
      throw ServiceError.notFound(`Er is geen gezinslid met id ${id}.`, { id });
    }
  }
  try {
    await geplandeTakenRepo.updateGeplandeTaakById(id, {
      naam,
      dag,
    });
    return getBygezinslidId(id);
  } catch (error) {
    throw handleDBError(error);
  }
};
const deleteById = async (id) => {
  try {
    const deleted = await geplandeTakenRepo.deleteGeplandeTaakById(id);

    if (!deleted) {
      throw ServiceError.notFound(`Geen geplande taak met id ${id} gevonden`, { id });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAll,
  getAllByDay,
  getAllByWeek,
  getBygezinslidId,
  create,
  updateById,
  deleteById,
};