let { GEPLANDE_TAKEN, GEZINSLEDEN } = require('../data/mock_data');

const getAll = () => {
  return {items: GEPLANDE_TAKEN};
};

const getById = (id) => {
  throw new Error('Not implemented yet!'); 
};
const create = ({ naam, dag, gezinslidId }) => {
  // let geldigGezinslid;
  // if (gezinslidId){
  //   geldigGezinslid = GEZINSLEDEN.find((id) => id===gezinslidId)
  // }
  // if (!geldigGezinslid){
  //   throw new Error('Er bestaat geen gezinslid met dit id')
  // }
  const maxId = Math.max(...GEPLANDE_TAKEN.map((taak) => taak.id))
  const newGeplandeTaak = {
    id: maxId+1,
    naam,
    dag: dag,
    gezinslidId
  }
  GEPLANDE_TAKEN.push(newGeplandeTaak);
  return newGeplandeTaak;
};
const updateById = (id, { naam, dag, gezinslidId}) => {
  throw new Error('Not implemented yet!');
};
const deleteById = (id) => {
  throw new Error('Not implemented yet!');
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};