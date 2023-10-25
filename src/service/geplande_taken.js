const { Logger } = require('winston');
let { GEPLANDE_TAKEN, GEZINSLEDEN } = require('../data/mock_data');
const { getLogger } = require('../core/logging');

const getAll = () => {
  return {items: GEPLANDE_TAKEN};
};

const getBygezinslidId = (id) => {
  return GEPLANDE_TAKEN.filter((taak) => taak.gezinslidId===id)
};

const create = ({ naam, dag, gezinslidId }) => {
  let geldigGezinslid;
  if (gezinslidId){
    geldigGezinslid = GEZINSLEDEN.find((gezinslid) => gezinslid.id===gezinslidId)
  }
  if (!geldigGezinslid){
    getLogger().error("Gezinslid niet gevonden")
  }
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
  getBygezinslidId,
  create,
  updateById,
  deleteById,
};