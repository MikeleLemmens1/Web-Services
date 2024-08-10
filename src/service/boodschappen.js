/**
 * Service for boodschap related REST operations.
 * @module service/boodschappen
 */

const { getLogger } = require('../core/logging');
const { getGezinById} = require('./gezinnen');
const handleDBError = require('./_handleDBError');
const ServiceError = require('../core/serviceError');
const { getSequelize } = require('../data');

/**
 * Get all boodschappen by gezin_id.
 * @param {number} id
 * @returns {Promise<gezin: string, boodschappen: Boodschappen[], count: number>}
 * @throws ServiceError.NOT_FOUND if no gezin with the given id exists.
 * @throws ServiceError.NOT_FOUND if the gezin has no boodschappen.
 */
const getAllBoodschappenByGezinsId = async (id) => { 
  const gezin = await getGezinById(id);
  const boodschappen = await getSequelize().models.Boodschap.findAll({
    where: { 
      gezin_id: gezin.id,
     },
  });
  if (boodschappen.length==0) {
    throw ServiceError.notFound(`Er zijn geen boodschappen voor gezin met id ${id}`, { id });
  }
  return {
    gezin: gezin.familienaam,
    boodschappen,
    count: boodschappen.length,
  };}

/**
 * Get all boodschappen for a given winkel by gezin_id.
 * @param {number} id
 * @returns {Promise<{gezin: string, boodschappen: Boodschappen[], count: number}>}
 * @throws ServiceError.NOT_FOUND if no gezin with the given id exists.
 * @throws ServiceError.NOT_FOUND if the gezin has no boodschappen for the given winkel.
 */
const getAllBoodschappenByWinkel = async (id,winkel) => {
  const gezin = await getGezinById(id);
  const boodschappen = await getSequelize().models.Boodschap.findAll({
    where: { 
      gezin_id: gezin.id,
      winkel: winkel,
     },
  });  if (boodschappen.length==0) {
    throw ServiceError.notFound(`Er zijn geen boodschappen voor de winkel ${winkel}`, { winkel });
  }
  return {
    gezin: gezin.familienaam,
    boodschappen,
    count: boodschappen.length,
  };
};

/**
 * Get boodschap by id
 * @param {*} id 
 * @returns Promise<Boodschap> 
 * @throws ServiceError.NOT_FOUND if no boodschap with the given id exists.
 */
const getBoodschapById = async (id) => {
  const boodschap = await getSequelize().models.Boodschap.findByPk(id);

  if (!boodschap) {
    throw ServiceError.notFound(`Er bestaat geen boodschap met id ${id}`, { id });
  }

  return boodschap;
};

/**
 * Create boodschap
 * @param {string} naam 
 * @param {string} winkel 
 * @param {string} hoeveelheid 
 * @param {number} gezin_id 
 * @returns Promise<Boodschap>
 * @throws ServiceError.NOT_FOUND if no gezin with the given id exists.
 */
const createBoodschap = async ({ naam, winkel, hoeveelheid, gezin_id }) => {
  await getGezinById(gezin_id);
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
/**
 * Modify boodschap
 * @param {number} id 
 * @param {string} naam 
 * @param {string} winkel 
 * @param {string} hoeveelheid 
 * @returns Promise<Boodschap>
 * @throws ServiceError.NOT_FOUND if no boodschap with the given id exists.
 */
const updateBoodschapById = async (id, { naam, winkel, hoeveelheid}) => {
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

/**
 * Delete a boodschap
 * @param {number} id 
 * @throws ServiceError.NOT_FOUND if no boodschap with the given id exists.
 */
const deleteBoodschapById = async (id) => {
  try {
    const deleted = await getBoodschapById(id);
    await deleted.destroy();

  } catch (error) {
    getLogger().error("Fout bij het verwijderen van de boodschap")
    throw handleDBError(error);
  }
};

module.exports = {
  getAllBoodschappenByGezinsId,
  getAllBoodschappenByWinkel,
  getBoodschapById,
  createBoodschap,
  updateBoodschapById,
  deleteBoodschapById,
};