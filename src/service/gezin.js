const { Logger } = require('winston');
const { getLogger } = require('../core/logging');
const gezinRepository = require('../repository/gezin'); // 👈 1

// const ServiceError = require('../core/serviceError');
// const handleDBError = require('./_handleDBError');

const getByGezinsId = async (id) => {
  return gezinRepository.getById(id);
};

const create = async ({ familienaam, straat, huisnummer, postcode, stad}) => {
  try {
    const id = await gezinRepository.createGezin({
      familienaam,
      straat,
      huisnummer,
      postcode,
      stad
    });
    return getBygezinsId(id);
  } catch (error) {
    
    getLogger().error("Fout bij het creëren van het gezin")
    throw handleDBError(error);
  }
};
const updateById = async (id, { familienaam, straat, huisnummer, postcode, stad}) => {
  try {
    await gezinRepository.updateGezinById(id, {
      familienaam,
      straat,
      huisnummer,
      postcode,
      stad,
    });
    return getByGezinsId(id);
  } catch (error) {
    getLogger().error("Fout bij het wijzigen van het gezin")
    throw handleDBError(error);
  }
};
const deleteById = async (id) => {try {
  const deleted = await gezinRepository.deleteGezinById(id);

  if (!deleted) {
    throw ServiceError.notFound(`Geen gezin met id ${id} gevonden`, { id });
  }
} catch (error) {  
  getLogger().error("Fout bij het verwijderen van het gezin")
  throw handleDBError(error);
}
};

module.exports = {
  getByGezinsId,
  create,
  updateById,
  deleteById,
};