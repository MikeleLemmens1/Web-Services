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
    as: 'Verjaardags',
    through: { attributes: []}
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

// TODO Use a transaction to create an instance to rollback when sth goes wrong?
// No verjaardagen or gezinsleden when creating a gezin?
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
};

const updateGezinById = async(id, { familienaam, straat, huisnummer, postcode, stad}) => {
  try {
    const gezin = await getGezinById(id);
    gezin.set(
      {familienaam, straat, huisnummer, postcode, stad}
    );
    return gezin;
  } catch (error){
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



module.exports = {
  getAllGezinnen,
  getGezinById,
  createGezin,
  updateGezinById,
  deleteGezinById,
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