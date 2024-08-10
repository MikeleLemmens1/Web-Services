/**
 * Service for geplande taken related REST operations.
 * @module service/geplande_taken
 */

const { getLogger } = require('../core/logging');
const gezinService = require('./gezinnen');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');
const { getGezinslidById } = require('./gezinsleden');
const { getSequelize } = require('../data');

/**
 * Get all geplande taken for a gezinslid.
 * @returns {Promise<{items: GeplandeTaak[], count: number}>}
 * @throws ServiceError.NOT_FOUND if no gezinslid with the given id exists.
 */
const getAllGeplandeTaken = async (ctx) => {

  const gezinslid = await getGezinslidById(ctx.params.id);
  const geplandeTaken = await getSequelize().models.GeplandeTaak.findAll({
    where: { gezinslid_id: gezinslid.id },
  });
  return {
    geplandeTaken,
    count: geplandeTaken.length,  
  };
};

/**
 * Get all geplande taken for a gezin.
 * @param {number} gezin_id
 * @returns {Promise<{items: GeplandeTaak[], count: number}>}
 * @throws ServiceError.NOT_FOUND if no gezin with the given id exists.
 */
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

/**
 * Get geplande taak by id.
 * @param {number} id
 * @returns {Promise<GeplandeTaak>}
 * @throws ServiceError.NOT_FOUND if no geplande taak with the given id exists.
 */
const getGeplandeTaakById = async (id) => {
  const geplandeTaak = await getSequelize().models.GeplandeTaak.findByPk(id);

  if (!geplandeTaak) {
    throw ServiceError.notFound(`Er bestaat geen geplande taak met id ${id}`, { id });
  }

  return geplandeTaak;
};
/**
 * Create a new geplande taak.
 * @param {number} gezinslid_id 
 * @param {string} naam
 * @param {string} dag
 * @returns {Promise<GeplandeTaak>}
 * @throws ServiceError.NOT_FOUND if no gezinslid with the given id exists.
 */
const createGeplandeTaak = async ({ naam, dag, gezinslid_id }) => {
  await getGezinslidById(gezinslid_id);

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

/**
 * Modify an existing geplande taak by taak_id.
 * @param {number} id
 * @param {number} taak_id
 * @param {string} naam
 * @param {string} dag
 * @returns {Promise<GeplandeTaak>}
 * @throws ServiceError.NOT_FOUND if no geplande taak with the given id exists.
 */
const updateGeplandeTaakById = async (id, taak_id, { naam, dag}) => {
  const geplandeTaak = await getGeplandeTaakById(taak_id);
  await geplandeTaak.set({
    naam,
    dag,

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
/**
 * Delete an existing geplande taak by taak_id.
 * @param {number} id
 * @param {number} taak_id
 * @throws ServiceError.NOT_FOUND if no geplande taak with the given id exists.
 */
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
  getAllGeplandeTakenFromGezin,
  getGeplandeTaakById,
  createGeplandeTaak,
  updateGeplandeTaakById,
  deleteGeplandeTaakById  ,
};