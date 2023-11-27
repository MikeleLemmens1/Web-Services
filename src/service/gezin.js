const { Logger } = require('winston');
let { GEZIN } = require('../data/mock_data');
const { getLogger } = require('../core/logging');
const gezinRepository = require('../repository/gezin'); // 👈 1


const getBygezinsId = async (id) => {
  return gezinRepository.getById(id);
  // return GEZIN.filter((gezin) => gezin.id===id)
};

// const getAll = () => {
//   return {items: GEPLANDE_TAKEN};
// };
// Routing voor toevoegen van Knex

//TODO Logger verdwenen

const create = ({ familienaam, straat, huisnummer, postcode, stad}) => {
  
  const maxId = Math.max(...GEZIN.map((gezin) => gezin.id))
  const newGezin = {
    id: maxId+1,
    familienaam,
    straat,
    huisnummer,
    postcode,
    stad
  }
  GEZIN.push(newGezin);
  return newGezin;
};
const updateById = (id, { familienaam, straat, huisnummer, postcode, stad}) => {
  let gezinToUpdate = GEZIN.find((gezin) => gezin.id === id);
  gezinToUpdate.familienaam = familienaam;
  gezinToUpdate.straat = straat;
  gezinToUpdate.huisnummer = huisnummer;
  gezinToUpdate.postcode = postcode;
  gezinToUpdate.stad = stad;
  return GEZIN.find(gezin => gezin.id === id);
};
const deleteById = (id) => {
  let index = GEZIN.findIndex((gezin)=>gezin.id===id)
  return GEZIN.splice(index,1)
};

module.exports = {
  getBygezinsId,
  create,
  updateById,
  deleteById,
};