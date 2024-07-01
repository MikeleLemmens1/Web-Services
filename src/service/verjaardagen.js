const { getLogger } = require('../core/logging');
const gezinService = require('../service/gezinnen')
const ServiceError = require('../core/serviceError')
const handleDBError = require('./_handleDBError');
const { getSequelize } = require('../data');

const getAllVerjaardagen = async () => {
  const verjaardagen = await getSequelize().models.Verjaardag.findAll();
  return {
    verjaardagen,
    count: verjaardagen.length,
  };
};

const getVerjaardagById = async (id) => {
  const verjaardag = await getSequelize().models.Verjaardag.findByPk(id);

  if (!verjaardag) {
    throw ServiceError.notFound(`Er bestaat geen verjaardag met id ${id}`, { id });
  }

  return verjaardag;
};

// const getVerjaardagenByGezinsId = async (id) => {
//   const gezin = await getSequelize().models.Gezin.findByPk(id);
//   if (!gezin) {
//     throw ServiceError.notFound(`Er bestaat geen gezin met id ${id}`, { id });
//   }
//   const verjaardagen = await verjaardagRepo.findVerjaardagenByGezinsId(id);

//   return verjaardagen;
// };

const createVerjaardag = async ({ voornaam, achternaam, dagnummer, maandnummer, gezin_id}) => {
  const gezin = await getGezinById(gezin_id);
  if (!gezin) {
    throw ServiceError.notFound(`Er bestaat geen gezin met id ${id}`, { id });
  }
  try {
    const verjaardag = await getSequelize().models.Verjaardag.create({
      voornaam,
      achternaam,
      dagnummer,
      maandnummer,
      gezin_id,
    });
    return getVerjaardagById(verjaardag.id);
  } catch (error) {
    getLogger().error("Fout bij het maken van de verjaardag")
    throw handleDBError(error);
  }
};
const updateVerjaardagById = async (id, {voornaam, achternaam, dagnummer, maandnummer}) => {
  // Het gezin kan niet worden aangepast
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
    // getLogger().error("Fout bij het wijzigen van de verjaardag");
    throw handleDBError(error);
  }
};
const deleteVerjaardagById = async (id) => {
  try {
    const deleted = await getBoodschapById(id);
    await deleted.destroy();
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
  // getVerjaardagenByGezinsId,
  createVerjaardag,
  updateVerjaardagById,
  deleteVerjaardagById,
  getVerjaardagById
}