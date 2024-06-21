const { getLogger } = require('../core/logging');
const boodschappenRepo = require('../repository/boodschap');
const { getGezinById} = require('./gezinnen');
const handleDBError = require('./_handleDBError');
const ServiceError = require('../core/serviceError');
const { getSequelize } = require('../data');

const getAllBoodschappen = async () => {
  const boodschappen = await getSequelize().models.Boodschap.findAll();
  return {
    boodschappen,
    count: boodschappen.length,
  };
};


const getAllBoodschappenByGezinsId = async (id) => { 
c
  const boodschappen = await getSequelize().models.Boodschap.findAll({
    where: { 
      gezin_id: gezin.id,
     },
  });
  if (!boodschappen) {
    throw ServiceError.notFound(`Er zijn geen boodschappen voor gezin met id ${id}`, { id });
  }

  return {
    boodschappen,
    count: boodschappen.length,
  };}

const getAllBoodschappenByWinkel = async (id,winkel) => {
  const gezin = await getSequelize().models.Gezin.findByPk(id);
  if (!gezin) {
    throw ServiceError.notFound(`Er bestaat geen gezin met id ${id}`, { id });
  }
  const boodschappen = await getSequelize().models.Boodschap.findAll({
    where: { 
      gezin_id: gezin.id,
      winkel: winkel,
     },
  });  if (!boodschappen) {
    throw ServiceError.notFound(`Er zijn geen boodschappen voor de winkel ${id}`, { id });
  }
  return {
    boodschappen,
    count: boodschappen.length,
  };
};

const getBoodschapById = async (id) => {
  const boodschap = await getSequelize().models.Boodschap.findByPk(id);

  if (!boodschap) {
    throw ServiceError.notFound(`Er bestaat geen boodschap met id ${id}`, { id });
  }

  return boodschap;
};


const createBoodschap = async ({ naam, winkel, hoeveelheid, gezin_id }) => {
  const gezin = await getGezinById(gezin_id);
  if (!gezin) {
    throw ServiceError.notFound(`Er bestaat geen gezin met id ${id}`, { id });
  }
  try {
    const boodschap = await getSequelize().models.Boodschap.create({
      naam,
      winkel,
      hoeveelheid,
      gezin_id
    });
    return getBoodschapById(boodschap.id);
  } catch (error) {
    getLogger().error("Fout bij het maken van de boodschap")
    throw handleDBError(error);
  }
};

const updateBoodschapById = async (id, { naam, winkel, hoeveelheid}) => {
  // Het gezin kan niet worden aangepast
  try {
    const boodschap = await getBoodschapById(id);
    await boodschap.set({
      naam,
      winkel,
      hoeveelheid
    });
    await boodschap.save();
    return getBoodschapById(id);
  } catch (error) {
    getLogger().error("Fout bij het wijzigen van de boodschap")
    throw handleDBError(error);
  }
};
const deleteBoodschapById = async (id) => {
  try {
    const deleted = await getBoodschapById(id);
    await deleted.destroy();
    if (!deleted) {
      throw ServiceError.notFound(`Geen boodschap met id ${id} gevonden`, { id });
    }
  } catch (error) {
    getLogger().error("Fout bij het verwijderen van de boodschap")
    throw handleDBError(error);
  }
};

module.exports = {
  getAllBoodschappen,
  // getAllBoodschappenByGezinsId,
  getAllBoodschappenByWinkel,
  getBoodschapById,
  createBoodschap,
  updateBoodschapById,
  deleteBoodschapById,
};