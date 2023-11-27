const {getKnex, tables}= require('../data/index');
const { getLogger } = require('../core/logging');
// const geplande_taken = require('../rest/geplande_taken');

const SELECT_COLUMNS = [
  `${tables.gezin}.id`,
  'familienaam',
  'straat',
  'huisnummer',
  'postcode',
  'stad',
];

/**
 * Geef alle geplande taken
 *
 */
const findAllGeplandeTaken = async()=> {
  return await getKnex()(tables.geplandeTaak).select().orderBy('id','ascending');
}


/**
 * Vind een geplande taak met een gegeven id.
 *
 * @param {number} id - id van de gezochte taak.
 */
const findGeplandeTaakById = async (id) => {
  return await getKnex()(tables.geplandeTaak).select().where('geplandeTaak.id',id);
}

/**
 * Vind alle geplande taken voor een dag.
 *
 * @param {Date} dag - dag van de gezochte taak.
 */
const findGeplandeTaakByDay = async (dag) => {
  return await getKnex()(tables.geplandeTaak).select().where('dag',dag);
}
/**
 * Maak een nieuwe geplande taak.
 *
 * @param {object} geplandeTaak - De nieuwe geplande taak
 * @param {number} geplandeTaak.naam - Naam van de geplande taak
 * @param {Date} geplandeTaak.dag - Dag van de geplande taak
 * @param {number} geplandeTaak.gezinslidId - Id van de uitvoerder
 *
 * @returns {Promise<number>} Id van de gemaakte taak
 */
const createGeplandeTaak = async ({ naam, dag, gezinslidId }) => {

  try{
  const [id] = await getKnex()(tables.geplandeTaak).insert({
    naam,
    dag,
    gezinslidId,
  });
  return id;
  } catch (error) {
    getLogger().error('Error in createGeplandeTaak', {
      error,
    });
    throw error;
  };
};

/**
 * Pas een bestaande geplande taak aan.
 *
 * @param {number} id - Id van de aan te passen taak
 * @param {object} geplandeTaak - De op te slagen taak
 * @param {number} geplandeTaak.naam - De naam van de taak
 * @param {Date} geplandeTaak.dag - De dag van de taak
 * @param {number} geplandeTaak.gezinslidId - De uitvoerder van de taak
 * 
 * @returns {Promise<number>} Id van de taak
 */
const updateGeplandeTaakById = async (id, {naam, dag, gezinslidId}) => {
  try{  
    const [mySQLid] = await getKnex()(tables.geplandeTaak).where('id', id).update({
      naam,
      gezinslidId,
      dag
    });
    return mySQLid;
  } catch (error) {
    getLogger().error('Error in updateGeplandeTaakById', {
      error,
    });
    throw error;
  } 
  };

/**
 * Verwijder een geplande taak met een gegeven id.
 *
 * @param {number} id - Id van de te verwijderen taak.
  *
 * @returns {Promise<boolean>} Of de geplande taak al dan niet is verwijderd.
 */
  
const deleteGeplandeTaakById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.geplandeTaak)
      .where(`${tables.geplandeTaak}.id`, id)
      .delete();

    return rowsAffected > 0;
  } catch (error) {
    getLogger().error('Error in deleteGeplandeTaakById', {
      error,
    });
    throw error;
  }
}

module.exports = {
  findAllGeplandeTaken,
  findGeplandeTaakById,
  findGeplandeTaakByDay,
  createGeplandeTaak,
  updateGeplandeTaakById,
  deleteGeplandeTaakById
};