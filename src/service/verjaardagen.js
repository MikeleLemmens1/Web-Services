/**
 * Service for verjaardag related REST operations.
 * @module service/verjaardagen
 */
const { getLogger } = require('../core/logging');
const gezinService = require('../service/gezinnen')
const ServiceError = require('../core/serviceError')
const handleDBError = require('./_handleDBError');
const { getSequelize } = require('../data');

/**
 * Displays the following attributes:
 * voornaam
 * achternaam
 * dagnummer
 * maandnummer
 */
const include = () => ({
  attributes:{
    exclude:['id','createdAt','updatedAt']
  } ,
  joinTableAttributes: []
});

/**
 * Get all verjaardagen for a gezin.
 * @returns {Promise<{items: Verjaardag[], count: number}>}
 * @throws ServiceError.NOT_FOUND if no gezin with the given id exists.
 */
const getAllVerjaardagen = async () => {
  const gezin = await gezinService.getGezinById(gezin_id);
  let verjaardagen = await gezin.getVerjaardagen(
    include());
  return {
    verjaardagen: verjaardagen,
    count: verjaardagen.length,
  };
};

/**
 * Get verjaardag by id.
 * @param {number} id
 * @returns {Promise<Verjaardag>}
 * @throws ServiceError.NOT_FOUND if no verjaardag with the given id exists.
 */
const getVerjaardagById = async (id) => {
  const verjaardag = await getSequelize().models.Verjaardag.findByPk(id);

  if (!verjaardag) {
    throw ServiceError.notFound(`Er bestaat geen verjaardag met id ${id}`, { id });
  }

  return verjaardag;
};

/**
 * Create a new verjaardag.
 * @param {string} voornaam
 * @param {string} achternaam
 * @param {number} dagnummer
 * @param {number} maandnummer
 * @param {number} gezin_id
 * @returns {Promise<Verjaardag>} 
 * @throws ServiceError.NOT_FOUND if no gezin with the given id exists.
 */
const createVerjaardag = async ({ voornaam, achternaam, dagnummer, maandnummer, gezin_id}) => {
  const gezin = await gezinService.getGezinById(gezin_id);

  try {
    const verjaardag = await getSequelize().models.Verjaardag.create({
      voornaam,
      achternaam,
      dagnummer,
      maandnummer,
    });
    gezin.addVerjaardagen(verjaardag);
    return getVerjaardagById(verjaardag.id);
  } catch (error) {
    getLogger().error("Fout bij het maken van de verjaardag")
    throw handleDBError(error);
  }
};

/**
 * Modify an existing verjaardag by id.
 * @param {number} id
 * @param {string} voornaam
 * @param {string} achternaam
 * @param {number} dagnummer
 * @param {number} maandnummer
 * @returns {Promise<Verjaardag>} 
 * @throws ServiceError.NOT_FOUND if no verjaardag with the given id exists.
 */
const updateVerjaardagById = async (id, {voornaam, achternaam, dagnummer, maandnummer}) => {
  try{
    const verjaardag = await getVerjaardagById(id);
    await verjaardag.set({
      voornaam,
      achternaam,
      dagnummer,
      maandnummer,
    });
    await verjaardag.save();
    return getVerjaardagById(id);
  }catch (error){
    getLogger().error("Fout bij het wijzigen van de verjaardag");
    throw handleDBError(error);
  }
};

/**
 * Delete verjaardag by id
 * @param {number} id
 * @throws ServiceError.NOT_FOUND if no verjaardag with the given id exists.
 */
const deleteVerjaardagById = async (id) => {
  try {
    const deleted = await getVerjaardagById(id);
    await deleted.destroy();
  } catch (error) {
    getLogger().error("Fout bij het verwijderen van de verjaardag")
    throw handleDBError(error);
  }
};

module.exports = {
  getAllVerjaardagen,
  createVerjaardag,
  updateVerjaardagById,
  deleteVerjaardagById,
  getVerjaardagById
}