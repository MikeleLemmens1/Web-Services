let { GEZINSLEDEN } = require('../data/mock_data')

const getAllGezinsleden = () => {
  return {items: GEZINSLEDEN};
};
const getGezinslidByID = (id) => {
  //TODO Error handling
  return GEZINSLEDEN.find(gezinslid => gezinslid.id === id);
};
const updateGezinslidByID = (id,{naam,email,wachtwoord,gezinsId,verjaardagsId}) => {
  //TODO Error handling
  let gezinslid = GEZINSLEDEN.find(lid => lid.id === id);
  gezinslid.naam = naam;
  gezinslid.email = email;
  gezinslid.wachtwoord = wachtwoord;
  gezinslid.gezinsId = gezinsId;
  gezinslid.verjaardagsId = verjaardagsId;
  return gezinslid;
};

const deleteGezinslidByID = (id) => {
  const index = GEZINSLEDEN.findIndex(gezinslid => gezinslid.id === id);
  //TODO Error handling
  if (index!==-1){
    return GEZINSLEDEN.splice(index,1);
  };
};

const createGezinslid = ({voornaam, email, wachtwoord, gezinsId, verjaardagsId}) => {
  //TODO: error handling
  const maxId = Math.max(...GEZINSLEDEN.map((gezinslid) => gezinslid.id));
  const newGezinslid = {
    id:maxId+1,
    voornaam,
    email,
    wachtwoord,
    gezinsId,
    verjaardagsId
  }
  GEZINSLEDEN.push(newGezinslid);
  return newGezinslid;

};

module.exports = {
  getAllGezinsleden,
  getGezinslidByID,
  updateGezinslidByID,
  deleteGezinslidByID,
  createGezinslid
}
