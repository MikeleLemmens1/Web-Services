const { getLogger } = require('../core/logging');
const verjaardagRepo = require('../repository/verjaardag')
const gezinService = require('../service/gezinnen')
const gezinsledenService = require('../service/gezinsleden')

const getAllVerjaardagen = async () => {
  const items = await verjaardagRepo.findAllVerjaardagen();
  return {
    items,
    count: items.length,
  };
};

const getAllVerjaardagenByGezin = async (id) => {
  const verjaardagen = await verjaardagRepo.getAllVerjaardagenByGezin(id);
  if (!verjaardagen){
    //TODO Service en DB Error
    //throw ServiceError.notFound(`Er bestaat geen taak met id ${id}`, { id });
  }
  return verjaardagen;
};

const getById = async (id) => {
  const verjaardag = await verjaardagRepo.findVerjaardagById(id);

  if (!verjaardag) {
    throw ServiceError.notFound(`Er bestaat geen verjaardag met id ${id}`, { id });
  }

  return verjaardag;
};
const create = async ({ voornaam, achternaam, dagnummer, maandnummer, gezinsId, gezinslidId }) => {
  let bestaandGezinslid = await gezinsledenService.getGezinslidById(gezinslidId);
  let bestaandGezin = await gezinService.getGezinById(gezinsId);
  if (!bestaandGezinslid){
    getLogger().error("Gezinslid niet gevonden")
    throw ServiceError.notFound(`Er is geen gezinslid id ${id}.`, { id });

  };
  if (!bestaandGezin){
    getLogger().error("Gezins niet gevonden")
    throw ServiceError.notFound(`Er is geen gezinsid ${id}.`, { id });

  }
  try {
    const id = await verjaardagRepo.createVerjaardag({
      voornaam,
      achternaam,
      dagnummer,
      maandnummer,
      gezinslidId,
      gezinsId,
    });
    return getById(id);
  } catch (error) {
    
    getLogger().error("Fout bij het maken van de verjaardag")
    throw handleDBError(error);
  }
};
const updateById = async (id, {voornaam, achternaam, dagnummer, maandnummer, gezinsId, gezinslidId}) => {
  if (gezinsId){
    const bestaandGezin = await gezinService.getGezinById(gezinsId);
    if (!gezinsId){
      throw ServiceError.notFound(`Er is geen gezin met id ${id}.`,{id})
    }

  }
  try{
    await verjaardagRepo.updateVerjaardag(id, {
      voornaam,
      achternaam,
      dagnummer,
      maandnummer,
      gezinsId,
      gezinslidId,
    });
    return getById(id);

  }catch (error){
    getLogger().error("Fout bij het wijzigen van de verjaardag");
    throw handleDBError(error);
  }
};
const deleteById = async (id) => {
  try {
    const deleted = await verjaardagRepo.deleteVerjaardag(id);

    if (!deleted) {
      throw ServiceError.notFound(`Geen verjaardag met id ${id} gevonden`, { id });
    }
  } catch (error) {
    getLogger().error("Fout bij het verwijderen van de verjaardag")
    throw handleDBError(error);
  }
};

module.exports = {
  getAllVerjaardagen,
  getAllVerjaardagenByGezin,
  create,
  updateById,
  deleteById,
}