const { Logger } = require('winston');
let { GEPLANDE_TAKEN, GEZINSLEDEN } = require('../data/mock_data');
const { getLogger } = require('../core/logging');
const geplandeTakenRepo = require('../repository/geplandeTaak');

const getAll = async () => {
  const items = await geplandeTakenRepo.findAllGeplandeTaken(); // 👈 2
  return {
    items,
    count: items.length,
  };
};

// const getAll = () => {
//   return {items: GEPLANDE_TAKEN};
// };
// Routing voor toevoegen van Knex

const getAllByDay = (dag) => { 
  //TODO: dag en week moet worden gespecifieerd
  return GEPLANDE_TAKEN.filter((taak) => new Date(taak.dag).getDay()=== dag)
}
const getAllByWeek = (week) => {
  //TODO
}
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
  console.log(GEPLANDE_TAKEN);
  return newGeplandeTaak;
};
const updateById = (id, { naam, dag, gezinslidId}) => {
  let taskToUpdate = GEPLANDE_TAKEN.find((taak) => taak.id === id);
  taskToUpdate.naam = naam;
  taskToUpdate.dag = dag;
  taskToUpdate.gezinslidId = gezinslidId;
  return GEPLANDE_TAKEN.find(taak => taak.id === id);
};
const deleteById = (id) => {
  let index = GEPLANDE_TAKEN.findIndex((taak)=>taak.id===id)
  return GEPLANDE_TAKEN.splice(index,1)
};

module.exports = {
  getAll,
  getAllByDay,
  getAllByWeek,
  getBygezinslidId,
  create,
  updateById,
  deleteById,
};