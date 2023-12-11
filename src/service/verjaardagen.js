const { getLogger } = require('../core/logging');
const verjaardagRepo = require('../repository/verjaardag')

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

//TODO Create update delete

module.exports = {
  getAllVerjaardagen,
}