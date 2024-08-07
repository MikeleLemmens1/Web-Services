const geplandeTakenService = require('./geplande_taken')
const handleDBError = require('./_handleDBError');
const ServiceError = require('../core/serviceError');
const { getSequelize } = require('../data/index');
const { getLogger } = require('../core/logging');


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

const getGezinById = async(id) => {
  const gezin = await getSequelize().models.Gezin.findByPk(id,include());
  if(!gezin){
    throw ServiceError.notFound(`Er bestaat geen gezin met id ${id}`, { id });
  }
  return gezin;
};

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

// const getGezinByGezinslidId = async(gezinslid_id) => {
//   const gezinslid = gezinsledenService.getGezinslidById(gezinslid_id);
//   return gezin;
// };

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

const deleteGezinById = async (id) => {
  try{
    const gezin = await getGezinById(id);
    await gezin.destroy();
  } catch (error) {
    getLogger().error('Error deleting gezin', {error});
    throw handleDBError(error);
  }
};

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

// const getAllBoodschappenFromGezin = async (id) => {
//   const gezin = await getGezinById(id);
//   const items = await gezin.getBoodschappen();
//   const boodschappen = []
//   for (const boodschap of items){
//     object  = {
//       naam: boodschap.dataValues.naam,
//       winkel: boodschap.dataValues.winkel,
//       hoeveelheid: boodschap.dataValues.hoeveelheid,
//     };
//     boodschappen.push(object);

//   }
//   const familienaam = gezin.dataValues.familienaam;

//   return{
//     gezin: familienaam,
//     boodschappen,
//     count: boodschappen.length
//   }
// }

// const getAllVerjaardagenFromGezin = async (id) => {
//   let items = await gezin.getVerjaardagen();
//   const verjaardagen = []
//   for (const verjaardag of items){
//     object  = {
//       voornaam: verjaardag.dataValues.voornaam,
//       achternaam: verjaardag.dataValues.achternaam,
//       dagnummer: verjaardag.dataValues.dagnummer,
//       maandnummer: verjaardag.dataValues.maandnummer
//     };
//     verjaardagen.push(object)
//   }
//   const familienaam = gezin.dataValues.familienaam;

//   return{
//     gezin:familienaam,
//     verjaardagen,
//     count: verjaardagen.length
//   }
// }

// const getAllGeplandeTakenFromGezin = async (id) => {
//   return await geplandeTakenService.getAllGeplandeTakenFromGezin(id);
  
// }

module.exports = {
  getAllGezinnen,
  getGezinById,
  createGezin,
  updateGezinById,
  deleteGezinById,
  getGezinByFamilienaam,
  getAllGezinsledenFromGezin,
  // getAllBoodschappenFromGezin,
  // getAllVerjaardagenFromGezin,
  // getAllGeplandeTakenFromGezin
};


