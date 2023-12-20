const { getLogger } = require('../core/logging');
const boodschappenRepo = require('../repository/boodschap');
const gezinService = require('./gezinnen');
const handleDBError = require('./_handleDBError');
const ServiceError = require('../core/serviceError');

const getAll = async () => {
  const items = await boodschappenRepo.findAllBoodschappen();
  return {
    items,
    count: items.length,
  };
};


const getAllByGezinsId = async (id) => { 
  const geldigGezin = await gezinService.getGezinById(id);
  if (!geldigGezin) {
    throw ServiceError.notFound(`Er bestaat geen gezin met id ${id}`, { id });
  }
  const items = await boodschappenRepo.findBoodschappenByGezinsId(id);
  if (!items) {
    throw ServiceError.notFound(`Er zijn geen boodschappen voor gezin met id ${id}`, { id });
  }

  return {
    items,
    count: items.length,
  };}

const getAllByWinkel = async (id,winkel) => {
  const items = await boodschappenRepo.findBoodschappenByWinkel(id,winkel);
  if (!items) {
    throw ServiceError.notFound(`Er zijn geen boodschappen voor de winkel ${id}`, { id });
  }
  return {
    items,
    count: items.length,
  };
};

const getById = async (id) => {
  const boodschap = await boodschappenRepo.findBoodschapByid(id);

  if (!boodschap) {
    throw ServiceError.notFound(`Er bestaat geen boodschap met id ${id}`, { id });
  }

  return boodschap;
};


const create = async ({ naam, winkel, hoeveelheid, gezin_id }) => {
  let bestaandGezin = await gezinService.getGezinById(gezin_id);
  if (!bestaandGezin){
    // getLogger().error("Gezin niet gevonden")
    throw ServiceError.notFound(`Er is geen gezin id ${id}.`, { id });

  }
  try {
    const id = await boodschappenRepo.createBoodschap({
      naam,
      winkel,
      hoeveelheid,
      gezin_id,
    });
    const boodschap = getById(id);
    return boodschap;
  } catch (error) {
    
    // getLogger().error("Fout bij het maken van de boodschap")
    throw handleDBError(error);
  }
};
const updateById = async (id, { naam, winkel, hoeveelheid, gezin_id}) => {
  const bestaandGezin = await gezinService.getGezinById(gezin_id);

    if (!bestaandGezin) {
      throw ServiceError.notFound(`Er is geen gezin met id ${id}.`, { id });
    }

  try {
    await boodschappenRepo.updateBoodschapById(id, {
      naam,
      winkel,
      hoeveelheid,
      gezin_id,
    });
    return getById(id);
  } catch (error) {
    // getLogger().error("Fout bij het wijzigen van de boodschap")
    throw handleDBError(error);
  }
};
const deleteById = async (id) => {
  try {
    const deleted = await boodschappenRepo.deleteBoodschapById(id);

    if (!deleted) {
      throw ServiceError.notFound(`Geen boodschap met id ${id} gevonden`, { id });
    }
  } catch (error) {
    // getLogger().error("Fout bij het verwijderen van de boodschap")
    throw handleDBError(error);
  }
};

module.exports = {
  getAll,
  getAllByGezinsId,
  getAllByWinkel,
  getById,
  create,
  updateById,
  deleteById,
};