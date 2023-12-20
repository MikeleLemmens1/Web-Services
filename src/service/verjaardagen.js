const { getLogger } = require('../core/logging');
const verjaardagRepo = require('../repository/verjaardag')
const gezinService = require('../service/gezinnen')
const ServiceError = require('../core/serviceError')
const handleDBError = require('./_handleDBError')

const getAllVerjaardagen = async () => {
  const items = await verjaardagRepo.findAllVerjaardagen();
  return {
    items,
    count: items.length,
  };
};

const getById = async (id) => {
  const verjaardag = await verjaardagRepo.findVerjaardagById(id);

  if (!verjaardag) {
    throw ServiceError.notFound(`Er bestaat geen verjaardag met id ${id}`, { id });
  }

  return verjaardag;
};

const getVerjaardagenByGezinsId = async (id) => {
  const verjaardagen = await verjaardagRepo.findVerjaardagenByGezinsId(id);
  if (!verjaardagen){
    throw ServiceError.notFound(`Er bestaat geen gezin met id ${id}`, { id });
  }
  return verjaardagen;
};
const createVerjaardag = async ({ voornaam, achternaam, dagnummer, maandnummer, gezin_id}) => {
  const bestaandGezin = await gezinService.getGezinById(gezin_id);
  if (!bestaandGezin){
    // getLogger().error("Gezin niet gevonden")
    throw ServiceError.notFound(`Er is geen gezinsid ${id}.`, { id });
  }
  try {
    const id = await verjaardagRepo.createVerjaardag({
      voornaam,
      achternaam,
      dagnummer,
      maandnummer,
      gezin_id,
    });
    return getById(id);
  } catch (error) {
    // getLogger().error("Fout bij het maken van de verjaardag")
    throw handleDBError(error);
  }
};
const updateVerjaardagById = async (id, {voornaam, achternaam, dagnummer, maandnummer}) => {
  
  try{
    await verjaardagRepo.updateVerjaardag(id, {
      voornaam,
      achternaam,
      dagnummer,
      maandnummer,
    });
    return getById(id);

  }catch (error){
    // getLogger().error("Fout bij het wijzigen van de verjaardag");
    throw handleDBError(error);
  }
};
const deleteVerjaardagById = async (id) => {
  try {
    const deleted = await verjaardagRepo.deleteVerjaardag(id);

    if (!deleted) {
      throw ServiceError.notFound(`Geen verjaardag met id ${id} gevonden`, { id });
    }
  } catch (error) {
    // getLogger().error("Fout bij het verwijderen van de verjaardag")
    throw handleDBError(error);
  }
};

module.exports = {
  getAllVerjaardagen,
  getVerjaardagenByGezinsId,
  createVerjaardag,
  updateVerjaardagById,
  deleteVerjaardagById,
  getById
}