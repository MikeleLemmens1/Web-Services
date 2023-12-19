const gezinRepository = require('../repository/gezin');
const handleDBError = require('./_handleDBError');
const ServiceError = require('../core/serviceError');

const getAllGezinnen = async () => {
  const items = await gezinRepository.findAllGezinnen();
  return {
    items,
    count: items.length,
  };
};

const getGezinById = async (id) => {
  const gezin = await gezinRepository.findGezinById(id);
  if (!gezin){
   throw ServiceError.notFound(`Er bestaat geen gezin met id ${id}`, { id });
  }
  return gezin;
};
//TODO: zorgen dat er geen dubbels kunnen worden gemaakt
const create = async ({ familienaam, straat, huisnummer, postcode, stad}) => {
  try {
    const id = await gezinRepository.createGezin({
      familienaam,
      straat,
      huisnummer,
      postcode,
      stad
    });
    return getGezinById(id);
  } catch (error) {
    
    // getLogger().error("Fout bij het creëren van het gezin")
    throw handleDBError(error);
  }
};
const updateGezinById = async (id, { familienaam, straat, huisnummer, postcode, stad}) => {
  try {
    await gezinRepository.updateGezinById(id, {
      familienaam,
      straat,
      huisnummer,
      postcode,
      stad,
    });
    return getGezinById(id);
  } catch (error) {
    // getLogger().error("Fout bij het wijzigen van het gezin")
    throw handleDBError(error);
  }
};
const deleteGezinById = async (id) => {try {
  const deleted = await gezinRepository.deleteGezinById(id);

  if (!deleted) {
    throw ServiceError.notFound(`Geen gezin met id ${id} gevonden`, { id });
  }
} catch (error) {  
  // getLogger().error("Fout bij het verwijderen van het gezin")
  throw handleDBError(error);
}
};

module.exports = {
  getAllGezinnen,
  getGezinById,
  create,
  updateGezinById,
  deleteGezinById,
};