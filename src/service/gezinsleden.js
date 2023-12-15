const gezinsledenRepo = require('../repository/gezinslid');
const { getLogger } = require('../core/logging');
const verjaardagService = require('./verjaardagen');
const gezinService = require('./gezinnen');
// const handleDBError = require('./_handleDBError');

const getAllGezinsleden = async () => {
  const items = await gezinsledenRepo.findAllGezinsleden();
  return {
    items,
    count: items.length,
  };  
};

const getGezinslidById = async (id) => {
  const gezinslid = await (gezinsledenRepo.findGezinslidById(id));
  if (!gezinslid) {
     //TODO Service en DB Error
    //throw ServiceError.notFound(`Er bestaat geen taak met id ${id}`, { id });
  }
  return gezinslid;
};
const getAllGezinsledenByGezinsId = async (id) => {
  const gezinsleden = await (gezinsledenRepo.findAllGezinsledenByGezinsId(id));
  if (!gezinsleden) {
     //TODO Service en DB Error
    //throw ServiceError.notFound(`Er bestaat geen taak met id ${id}`, { id });
  }
  return gezinsleden;
};

const createGezinslid = async ({voornaam, email, wachtwoord, gezinsId, verjaardagsId}) => {
  let geldigGezin;
  let geldigeVerjaardag;
  if(gezinsId){
    geldigGezin = await gezinService.getGezinById(gezinsId);
  }
  if(verjaardagsId){
    geldigeVerjaardag = await verjaardagService.getVerjaardagById(verjaardagsId);
  }
  if(!geldigGezin){
    getLogger().error("Gezin niet gevonden")
  }
  if(!geldigeVerjaardag){
    getLogger().error("Verjaardag ongeldig")
  }
  try{
    const id = await gezinsledenRepo.createGezinslid({
      gezinsId,
      voornaam,
      email,
      wachtwoord,
      verjaardagsId,
    });
    return getGezinslidById(id);
  }catch (error) {
    getLogger().error('Fout bij het maken van het gezinslid')
    // throw handleDBError(error);
  }
};

const updateGezinslidById = async (id,{voornaam, email, wachtwoord, gezinsId, verjaardagsId}) => {

  if(gezinsId){
    const bestaandGezin = await gezinService.getGezinById(gezinsId);
    if(!bestaandGezin){
      getLogger().error("Gezin niet gevonden");
      // throw ServiceError.notFound(`Er is geen gezin met id ${gezinsId}.`,{gezinsId});
    }
  }
  if(verjaardagsId){
    const geldigeVerjaardag = await verjaardagService.getVerjaardagById(verjaardagsId);
    if(!geldigeVerjaardag){
      getLogger().error("Verjaardag ongeldig")
      // throw ServiceError.notFound(`Er is geen verjaardag met id ${verjaardagsId}.`,{verjaardagsId});
      
    }
  }
  try{
    await gezinsledenRepo.updateGezinslidById(id, {
      gezinsId,
      voornaam,
      email,
      wachtwoord,
      verjaardagsId,
    });
    return getGezinslidById(id);
  }catch (error) {
    getLogger().error('Fout bij het maken van het gezinslid')
    // throw handleDBError(error);
  }
};
const deleteGezinslidById = async (id) => {
  try {
    const deleted = await gezinsledenRepo.deletegezinslidById(id);

    if (!deleted) {
      // throw ServiceError.notFound(`Geen gezinslid met id ${id} gevonden`, { id });
    }
  } catch (error) {
    getLogger().error("Fout bij het verwijderen van het gezinslid")
    // throw handleDBError(error);
  }
};



module.exports = {
  getAllGezinsleden,
  getGezinslidById,
  getAllGezinsledenByGezinsId,
  createGezinslid,
  updateGezinslidById,
  deleteGezinslidById,
  
}
