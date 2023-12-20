const { getLogger } = require('../core/logging');
const geplandeTakenRepo = require('../repository/geplandeTaak');
const gezinsledenService = require('./gezinsleden');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');

const getAll = async () => {
  const items = await geplandeTakenRepo.findAllGeplandeTaken();
  return {
    items,
    count: items.length,
  };
};


const getAllByDay = async (dag) => { 
  const geplandeTaken = await geplandeTakenRepo.findGeplandeTakenByDay(dag);
  if (!geplandeTaken) {
    throw ServiceError.notFound(`Er bestaat geen taak voor dag ${dag}`, { dag });
  }

  return geplandeTaken;
}

const getAllByWeek = (week) => {
  //TODO
}
const getAllByGezinslidId = async (id) => {
  const geldigGezinslid = await gezinsledenService.getGezinslidById(id);
  if (!geldigGezinslid) {
    throw ServiceError.notFound(`Er bestaat geen gezinslid met id ${id}`, { id });
  }
  const geplandeTaken = await geplandeTakenRepo.findGeplandeTakenByGezinslidId(id);
  if (!geplandeTaken) {
    throw ServiceError.notFound(`Er zijn geen geplande taken voor gezinslid met id ${id}`, { id });
  }
  return {
    geplandeTaken,
    count: geplandeTaken.length 
  }
};

const getById = async (id) => {
  const geplandeTaak = await geplandeTakenRepo.findGeplandeTaakById(id);

  if (!geplandeTaak) {
    throw ServiceError.notFound(`Er bestaat geen geplande taak met id ${id}`, { id });
  }

  return geplandeTaak;
};


const create = async ({ naam, dag, gezinslid_id }) => {
  let bestaandGezinslid = await gezinsledenService.getGezinslidById(gezinslid_id);
  if (!bestaandGezinslid){
    // getLogger().error("Gezinslid niet gevonden")
    throw ServiceError.notFound(`Er is geen gezinslid id ${id}.`, { id });

  }
  try {
    const id = await geplandeTakenRepo.createGeplandeTaak({
      naam,
      dag,
      gezinslid_id,
    });
    return getById(id);
  } catch (error) {
    
    // getLogger().error("Fout bij het maken van de geplande taak")
    throw handleDBError(error);
  }
};
const updateById = async (id, { naam, dag, gezinslid_id}) => {
  if (gezinslid_id) {
    const bestaandGezinslid = await gezinsledenService.getGezinslidById(gezinslid_id);

    if (!bestaandGezinslid) {
      throw ServiceError.notFound(`Er is geen gezinslid met id ${id}.`, { id });
    }
  }
  try {
    await geplandeTakenRepo.updateGeplandeTaakById(id, {
      naam,
      dag,
      gezinslid_id,
    });
    return getById(id);
  } catch (error) {
    // getLogger().error("Fout bij het wijzigen van de geplande taak")
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
    // getLogger().error("Fout bij het verwijderen van de geplande taak")
    throw handleDBError(error);
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