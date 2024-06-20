// Repository no longer necessary when using seq
// const gezinRepository = require('../repository/gezin');
const handleDBError = require('./_handleDBError');
const ServiceError = require('../core/serviceError');
const { getSequelize } = require('../data/index');


// console.log(getSequelize());

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


const getAllGezinnen = async () => {
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
  return gezin;
};

const createGezin = async ({ familienaam, straat, huisnummer, postcode, stad}) => {
  try{
    const gezin = await getSequelize().models.Gezin.create({
      familienaam, straat, huisnummer, postcode, stad
    });
    return gezin;
    // OR return await getGezinById(gezin.id) to use service error?
  }
  catch(error){
    getLogger().error('Error creating gezin', {error});
    throw handleDBError(error);
  }
}

const updateGezinById = async(id, { familienaam, straat, huisnummer, postcode, stad}) => {
  try{
    const gezin = await getGezinById(id);
    gezin.set({
      familienaam, straat, huisnummer, postcode, stad
    });
    gezin.save();
    return gezin;
    // OR return await getGezinById(gezin.id) to use service error?
  }
  catch(error){
    getLogger().error('Error creating gezin', {error});
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

const getAllGezinsleden = async (id) => {
  const gezin = await getGezinById(id);
  const gezinsleden = await gezin.getGezinsleden();
  const familienaam = gezin.dataValues.familienaam;

  return{
    gezin:familienaam,
    gezinsleden,
    count: gezinsleden.length
  }
}

const getAllBoodschappen = async (id) => {
  const gezin = await getGezinById(id);
  const items = await gezin.getBoodschappen();
  const boodschappen = []
  for (const boodschap of items){
    object  = {
      naam: boodschap.dataValues.naam,
      winkel: boodschap.dataValues.winkel,
      hoeveelheid: boodschap.dataValues.hoeveelheid,
    };
    boodschappen.push(object);

  }
  const familienaam = gezin.dataValues.familienaam;

  return{
    gezin: familienaam,
    boodschappen,
    count: boodschappen.length
  }
}

const getAllVerjaardagen = async (id) => {
  const gezin = await getGezinById(id);
  let items = await gezin.getVerjaardagen();
  const verjaardagen = []
  for (const verjaardag of items){
    object  = {
      voornaam: verjaardag.dataValues.voornaam,
      achternaam: verjaardag.dataValues.achternaam
    };
    verjaardagen.push(object)
  }
  const familienaam = gezin.dataValues.familienaam;

  return{
    gezin:familienaam,
    verjaardagen,
    count: verjaardagen.length
  }
}

module.exports = {
  getAllGezinnen,
  getGezinById,
  createGezin,
  updateGezinById,
  deleteGezinById,
  getGezinByFamilienaam,
  getAllGezinsleden,
  getAllBoodschappen,
  getAllVerjaardagen
};


// Using Knex

// const getAllGezinnen = async () => {
//   const items = await gezinRepository.findAllGezinnen();
//   return {
//     items,
//     count: items.length,
//   };
// };

// const getGezinById = async (id) => {
//   const gezin = await gezinRepository.findGezinById(id);
//   if (!gezin){
//    throw ServiceError.notFound(`Er bestaat geen gezin met id ${id}`, { id });
//   }
//   return gezin;
// };
//TODO: zorgen dat er geen dubbels kunnen worden gemaakt

// const create = async ({ familienaam, straat, huisnummer, postcode, stad}) => {
  //   try {
  //     const id = await gezinRepository.createGezin({
  //       familienaam,
  //       straat,
  //       huisnummer,
  //       postcode,
  //       stad
  //     });
  //     return getGezinById(id);
  //   } catch (error) {
      
  //     // getLogger().error("Fout bij het creëren van het gezin")
  //     throw handleDBError(error);
  //   }
  // };

  // const updateGezinById = async (id, { familienaam, straat, huisnummer, postcode, stad}) => {
  //   try {
  //     await gezinRepository.updateGezinById(id, {
  //       familienaam,
  //       straat,
  //       huisnummer,
  //       postcode,
  //       stad,
  //     });
  //     return getGezinById(id);
  //   } catch (error) {
  //     // getLogger().error("Fout bij het wijzigen van het gezin")
  //     throw handleDBError(error);
  //   }
  // };

  // const deleteGezinById = async (id) => {try {
  //   const deleted = await gezinRepository.deleteGezinById(id);
  
  //   if (!deleted) {
  //     throw ServiceError.notFound(`Geen gezin met id ${id} gevonden`, { id });
  //   }
  // } catch (error) {  
  //   // getLogger().error("Fout bij het verwijderen van het gezin")
  //   throw handleDBError(error);
  // }
  // };