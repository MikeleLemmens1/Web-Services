/**
 * Service for gezin related REST operations.
 * @module service/gezinnen
 */

const handleDBError = require('./_handleDBError');
const ServiceError = require('../core/serviceError');
const { getSequelize } = require('../data/index');
const { getLogger } = require('../core/logging');

/**
 * Displays the following attributes:
 * Gezinsleden (voornaam, email)
 * Boodschappen (naam, winkel)
 * Verjaardagen
 */
const include = () => ({
  include: [
    {
    model: getSequelize().models.Gezinslid,
    as: 'Gezinsleden',
    attributes: ['voornaam','email']
    // through enkel gebruiken voor tussentabellen  
    // through: { attributes: []},
    },
    {
    model: getSequelize().models.Boodschap,
    as: 'Boodschappen',
    attributes: ['naam','winkel']
    },
    {
    model: getSequelize().models.Verjaardag,
    as: 'Verjaardagen',
    through: { attributes: [/*'voornaam','achternaam','dagnummer','maandnummer'*/]}
    }
          ]
});

/**
 * Get all gezinnen. Filter by familienaam when given.
 * 
 * @param {string} familienaam
 * @returns {Promise<{items: Gezin[], count: number}>}
 */
const getAllGezinnen = async (familienaam) => {
  if (familienaam){
    return getGezinByFamilienaam(familienaam);
  };
  const items = await getSequelize().models.Gezin.findAll(include());
  return{
    items,
    count: items.length,
  };
}
/**
 * Get gezin by id.
 * @param {number} id
 * @returns {Promise<Gezin>}
 * @throws ServiceError.NOT_FOUND if no gezin with the given id exists.
 */
const getGezinById = async(id) => {
  const gezin = await getSequelize().models.Gezin.findByPk(id,include());
  if(!gezin){
    throw ServiceError.notFound(`Er bestaat geen gezin met id ${id}`, { id });
  }
  return gezin;
};
/**
 * Get gezin by familienaam.
 * @param {string} familienaam
 * @returns {Promise<Gezin>}
 * @throws ServiceError.NOT_FOUND if no gezin with the given familienaam exists.
 */
const getGezinByFamilienaam = async(familienaam) => {
  const gezin = await getSequelize().models.Gezin.findOne({
    where: {
      familienaam: familienaam,
    },
    ...include()
  });
  if(!gezin){
    throw ServiceError.notFound(`Er bestaat geen gezin genaamd ${familienaam}`, { familienaam });
  }
  return gezin;
};
/**
 * Create a new gezin.
 * @param {string} familienaam
 * @param {string} straat
 * @param {number} huisnummer
 * @param {number} postcode
 * @param {string} stad
 * @returns {Promise<Gezin>}
 */
const createGezin = async ({ familienaam, straat, huisnummer, postcode, stad}) => {
  try{
    const gezin = await getSequelize().models.Gezin.create({
      familienaam, straat, huisnummer, postcode, stad
    });
    return await getGezinById(gezin.id);
  }
  catch(error){
    getLogger().error('Error creating gezin', {error});
    throw handleDBError(error);
  }
}
/**
 * Modify an existing gezin by id.
 * @param {number} id
 * @param {string} familienaam
 * @param {string} straat
 * @param {number} huisnummer
 * @param {number} postcode
 * @param {string} stad
 * @returns {Promise<Gezin>}
 * @throws ServiceError.NOT_FOUND if no gezin with the given id exists.
 */
const updateGezinById = async(id, { familienaam, straat, huisnummer, postcode, stad}) => {
  try{
    const gezin = await getGezinById(id);
    await gezin.set({
      familienaam, straat, huisnummer, postcode, stad
    });
    await gezin.save();
    return await getGezinById(gezin.id);
  }
  catch(error){
    getLogger().error('Error updating gezin', {error});
    throw handleDBError(error);
  }
}
/**
 * Delete an existing gezin by id.
 * @param {number} id
 * @throws ServiceError.NOT_FOUND if no gezin with the given id exists.
 */
const deleteGezinById = async (id) => {
  try{
    const gezin = await getGezinById(id);
    await gezin.destroy();
  } catch (error) {
    getLogger().error('Error deleting gezin', {error});
    throw handleDBError(error);
  }
};

/**
 * Get all gezinsleden from a gezin by id.
 * @param {number} id
 * @throws ServiceError.NOT_FOUND if no gezin with the given id exists.
 */
const getAllGezinsledenFromGezin = async (id) => {
  const gezin = await getGezinById(id);
  const gezinsleden = await gezin.getGezinsleden();
  const familienaam = gezin.dataValues.familienaam;

  return{
    gezin:familienaam,
    gezinsleden,
    count: gezinsleden.length
  }
}

module.exports = {
  getAllGezinnen,
  getGezinById,
  createGezin,
  updateGezinById,
  deleteGezinById,
  getGezinByFamilienaam,
  getAllGezinsledenFromGezin,
};


