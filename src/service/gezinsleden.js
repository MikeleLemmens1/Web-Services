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

const createGezinslid = async ({voornaam, email, wachtwoord, gezin_id, verjaardag_id}) => {
  let geldigGezin;
  let geldigeVerjaardag;
  if(gezin_id){
    geldigGezin = await gezinService.getGezinById(gezin_id);
  }
  if(verjaardag_id){
    geldigeVerjaardag = await verjaardagService.getAllVerjaardagen(verjaardag_id);
  }
  if(!geldigGezin){
    getLogger().error("Gezin niet gevonden")
  }
  if(!geldigeVerjaardag){
    getLogger().error("Verjaardag ongeldig")
  }
  try{
    const id = await gezinsledenRepo.createGezinslid({
      gezin_id,
      voornaam,
      email,
      wachtwoord,
      verjaardag_id,
    });
    return getGezinslidById(id);
  }catch (error) {
    getLogger().error('Fout bij het maken van het gezinslid')
    // throw handleDBError(error);
  }
};

const updateGezinslidById = async (id,{voornaam, email, wachtwoord, gezin_id, verjaardag_id}) => {

  if(gezin_id){
    const bestaandGezin = await gezinService.getGezinById(gezin_id);
    if(!bestaandGezin){
      getLogger().error("Gezin niet gevonden");
      // throw ServiceError.notFound(`Er is geen gezin met id ${gezin_id}.`,{gezin_id});
    }
  }
  if(verjaardag_id){
    const geldigeVerjaardag = await verjaardagService.getById(verjaardag_id);
    if(!geldigeVerjaardag){
      getLogger().error("Verjaardag ongeldig")
      // throw ServiceError.notFound(`Er is geen verjaardag met id ${verjaardag_id}.`,{verjaardag_id});
      
    }
  }
  try{
    await gezinsledenRepo.updateGezinslidById(id, {
      gezin_id,
      voornaam,
      email,
      wachtwoord,
      verjaardag_id,
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
