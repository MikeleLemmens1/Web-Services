const gezinsledenRepo = require('../repository/gezinslid');
const verjaardagService = require('./verjaardagen');
const gezinService = require('./gezinnen');
const handleDBError = require('./_handleDBError');
const ServiceError = require('../core/serviceError');
const { getSequelize } = require('../data/index');

const include = () => ({
  attributes: {
    exclude :['verjaardag_id','gezin_id']
  },
  include: [
    {
    model: getSequelize().models.GeplandeTaak,
    as: 'GeplandeTaken',
    attributes: ['naam','dag']
    // through enkel gebruiken voor tussentabellen  
    // through: { attributes: []},
    },
    {
    model: getSequelize().models.Verjaardag,
    as: 'Verjaardag',
    attributes: ['dagnummer','maandnummer']
    },
          ]
});

const getAllGezinsleden = async () => {
  const items = await getSequelize().models.Gezinslid.findAll(include());
  return{
    items,
    count: items.length,
  }; 
};

const getGezinslidById = async (id) => {
  const gezinslid = await gezinsledenRepo.findGezinslidById(id);
  if (!gezinslid) {
   throw ServiceError.notFound(`Er bestaat geen gezinslid met id ${id}`, { id });
  }
  return gezinslid;
};
const getAllGezinsledenByGezinsId = async (id) => {
  const gezinsleden = await (gezinsledenRepo.findAllGezinsledenByGezinsId(id));
  if (!gezinsleden) {
    throw ServiceError.notFound(`Er bestaat geen gezin met id ${id}`, { id });
  }
  return gezinsleden;
};

const createGezinslid = async ({voornaam, email, wachtwoord, gezin_id, verjaardag_id}) => {

  const bestaandGezin = await gezinService.getGezinById(gezin_id);
  const bestaandeVerjaardag = await verjaardagService.getById(verjaardag_id);

  if(!bestaandGezin){
    throw ServiceError.notFound(`Er bestaat geen gezin met id ${id}`, { id });
  } 
  if(!bestaandeVerjaardag){
    throw ServiceError.notFound(`Er bestaat geen verjaardag met id ${id}`, { id });
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
    // getLogger().error('Fout bij het maken van het gezinslid')
    throw handleDBError(error);
  }
};

const updateGezinslidById = async (id,{voornaam, email, wachtwoord, gezin_id, verjaardag_id}) => {

  if(gezin_id){
    const bestaandGezin = await gezinService.getGezinById(gezin_id);
    if(!bestaandGezin){
      // getLogger().error("Gezin niet gevonden");
      throw ServiceError.notFound(`Er is geen gezin met id ${gezin_id}.`,{gezin_id});
    }
  }
  if(verjaardag_id){
    const geldigeVerjaardag = await verjaardagService.getById(verjaardag_id);
    if(!geldigeVerjaardag){
      // getLogger().error("Verjaardag ongeldig")
      throw ServiceError.notFound(`Er is geen verjaardag met id ${verjaardag_id}.`,{verjaardag_id});
      
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
    // getLogger().error('Fout bij het maken van het gezinslid')
    throw handleDBError(error);
  }
};
const deleteGezinslidById = async (id) => {
  try {
    const deleted = await gezinsledenRepo.deletegezinslidById(id);

    if (!deleted) {
      throw ServiceError.notFound(`Geen gezinslid met id ${id} gevonden`, { id });
    }
  } catch (error) {
    // getLogger().error("Fout bij het verwijderen van het gezinslid")
    throw handleDBError(error);
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
